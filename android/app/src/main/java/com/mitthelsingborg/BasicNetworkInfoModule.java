package com.mitthelsingborg;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.ConnectivityManager.NetworkCallback;
import android.net.LinkAddress;
import android.net.LinkProperties;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BasicNetworkInfoModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private class NetworkAggregatedInfo {
        public Network network;
        public boolean isBlocked;
        public NetworkCapabilities networkCapabilities;
        public LinkProperties linkProperties;

        public NetworkAggregatedInfo() {
            network = null;
            networkCapabilities = null;
            linkProperties = null;
            isBlocked = false;
        }
    }

    private class CustomNetworkCallback extends NetworkCallback {
        private final int INITIAL_NETWORKS_CAPACITY = 5;
        public ConcurrentHashMap<Network, NetworkAggregatedInfo> networks;

        CustomNetworkCallback() {
            networks = new ConcurrentHashMap<Network, NetworkAggregatedInfo>(INITIAL_NETWORKS_CAPACITY);
        }

        @Override
        public void onAvailable(Network network) {
            NetworkAggregatedInfo newInfo = new NetworkAggregatedInfo();
            newInfo.network = network;
            this.networks.put(network, newInfo);
        }

        @Override
        public void onCapabilitiesChanged(Network network, NetworkCapabilities networkCapabilities) {
            NetworkAggregatedInfo netInfo = this.networks.get(network);
            if (netInfo != null) {
                netInfo.networkCapabilities = networkCapabilities;
            }
        }

        @Override
        public void onLinkPropertiesChanged(Network network, LinkProperties linkProperties) {
            NetworkAggregatedInfo netInfo = this.networks.get(network);
            if (netInfo != null) {
                netInfo.linkProperties = linkProperties;
            }
        }

        @Override
        public void onLosing(Network network, int maxMsToLive) {
            this.networks.remove(network);
        }

        @Override
        public void onLost(Network network) {
            this.networks.remove(network);
        }
    }

    private static final int[] REQUIRED_NETWORK_CAPABILITIES = {
            NetworkCapabilities.NET_CAPABILITY_INTERNET,
            NetworkCapabilities.NET_CAPABILITY_NOT_RESTRICTED,
            NetworkCapabilities.NET_CAPABILITY_TRUSTED,
            NetworkCapabilities.NET_CAPABILITY_VALIDATED,
            NetworkCapabilities.NET_CAPABILITY_FOREGROUND
    };

    private static final int[] SUPPORTED_TRANSPORT_TYPES = {
            NetworkCapabilities.TRANSPORT_CELLULAR,
            NetworkCapabilities.TRANSPORT_ETHERNET,
            NetworkCapabilities.TRANSPORT_WIFI
    };

    /** Pattern for IPv4-addresses reserved for IPv6 Dual-Stack Lite */
    private static Pattern DSLitePattern = Pattern.compile("^192\\.0\\.0\\.[0-7]$");

    ConnectivityManager ConnectManager;
    CustomNetworkCallback ConnectionCallback;

    BasicNetworkInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);

        ConnectManager = (ConnectivityManager) reactContext.getApplicationContext()
                .getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkRequest networkRequest = new NetworkRequest.Builder()
                .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
                .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
                .addTransportType(NetworkCapabilities.TRANSPORT_ETHERNET)
                .build();

        ConnectionCallback = new CustomNetworkCallback();

        ConnectManager.registerNetworkCallback(networkRequest, ConnectionCallback);
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        ConnectManager.unregisterNetworkCallback(ConnectionCallback);
    }

    @Override
    public String getName() {
        return "BasicNetworkInfoModule";
    }

    private static boolean DoesNetworkHaveRequiredCapabilities(NetworkAggregatedInfo networkInfo) {
        NetworkCapabilities netCaps = networkInfo.networkCapabilities;

        if (netCaps != null) {
            boolean hasCaps = true;
            for (int cap : REQUIRED_NETWORK_CAPABILITIES) {
                hasCaps &= netCaps.hasCapability(cap);
            }

            return hasCaps;
        }

        return false;
    }

    private static boolean IsNetworkOfSupportedTransportType(NetworkAggregatedInfo networkInfo) {
        NetworkCapabilities netCaps = networkInfo.networkCapabilities;

        if (netCaps != null) {
            boolean hasValidTransportType = false;
            for (int transportType : SUPPORTED_TRANSPORT_TYPES) {
                hasValidTransportType |= netCaps.hasTransport(transportType);
            }

            return hasValidTransportType;
        }

        return false;
    }

    private static String GetFirstValidIPv4Address(NetworkAggregatedInfo networkInfo) {
        LinkProperties linkProps = networkInfo.linkProperties;

        if (linkProps != null) {
            List<LinkAddress> addresses = linkProps.getLinkAddresses();
            ListIterator<LinkAddress> iterator = addresses.listIterator();

            while (iterator.hasNext()) {
                LinkAddress linkAddress = iterator.next();
                InetAddress inetAddress = linkAddress.getAddress();

                boolean addressIsLoopback = inetAddress.isLoopbackAddress();
                boolean addressIsIPv4 = inetAddress instanceof Inet4Address;

                if (!addressIsLoopback && addressIsIPv4) {
                    String addressString = inetAddress.getHostAddress();
                    Matcher dsliteMatcher = DSLitePattern.matcher(addressString);

                    if (!dsliteMatcher.matches()) {
                        return addressString;
                    }
                }
            }
        }

        return null;
    }

    @ReactMethod
    public void GetIPv4Address(Promise promise) {
        new Thread(new Runnable() {
            public void run() {
                try {
                    String finalAddress = null;

                    for (Enumeration<NetworkAggregatedInfo> networks = ConnectionCallback.networks.elements(); networks
                            .hasMoreElements();) {
                        NetworkAggregatedInfo network = networks.nextElement();

                        boolean hasRequiredCapabilities = DoesNetworkHaveRequiredCapabilities(network);
                        boolean isOfSupportedType = IsNetworkOfSupportedTransportType(network);

                        if (hasRequiredCapabilities && isOfSupportedType) {
                            String ipv4Address = GetFirstValidIPv4Address(network);

                            if (ipv4Address != null) {
                                finalAddress = ipv4Address;
                                break;
                            }
                        }
                    }

                    promise.resolve(finalAddress);
                } catch (Exception e) {
                    promise.resolve(null);
                }
            }
        }).start();
    }
}
