//
//  mitt_helsingborg_playgroundUITakeScreenshots.swift
//  mitt_helsingborg_playgroundUITakeScreenshots
//
//  Created by Ehsan Zilaei on 2019-06-12.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class mitt_helsingborg_playgroundUITakeScreenshots: XCTestCase {

    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        XCUIApplication()/*@START_MENU_TOKEN@*/.staticTexts["Welcome to React Native!"].swipeRight()/*[[".otherElements.matching(identifier: \"Welcome to React Native! (Now with react-navigation 🤘) To get started, edit App.js Press Cmd+R to reload,\\nCmd+D or shake for dev menu\").staticTexts[\"Welcome to React Native!\"]",".swipeDown()",".swipeRight()",".staticTexts[\"Welcome to React Native!\"]"],[[[-1,3,1],[-1,0,1]],[[-1,2],[-1,1]]],[0,0]]@END_MENU_TOKEN@*/
        snapshot("01WelcomeScreen")
        
    }

}
