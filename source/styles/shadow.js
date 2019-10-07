import { css } from 'styled-components/native';

let z = {};

z[4] = css`
    shadow-color: #000;

    shadow-offset: -2px 12px;
    shadow-opacity: 0.3;
    shadow-radius: 12;

    elevation: 4;
`;

z[3] = css`
    shadow-color: #000;

    shadow-offset: 0 8px;
    shadow-opacity: 0.3;
    shadow-radius: 8;

    elevation: 3;
`;

z[2] = css`
    shadow-color: #000;

    shadow-offset: 0px 6px;
    shadow-opacity: 0.3;
    shadow-radius: 6;

    elevation: 2;
`;

z[1] = css`
    shadow-color: #000;

    shadow-offset: -0px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 2;

    elevation: 1;
`;

z[0] = css`
    shadow-color: #000;

    shadow-offset: 0px 0px;
    shadow-opacity: 0;
    shadow-radius: 0;

    elevation: 0;
`;

export default z;