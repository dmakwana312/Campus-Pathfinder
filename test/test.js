describe('Register Tests', function () {

    beforeEach(function () {
        browser.url('./');
    })

    it('Register Modal Should Be Shown', function () {

        const registerHintButton = $('#registerHint');
        registerHintButton.click();

        const registerModal = $('#registerModal')
        expect(registerModal).toExist()

    })

    it('Invalid Email Should Not Pass Validation', function () {
        const registerHintButton = $('#registerHint');
        registerHintButton.click();

        const emailTextField = $('#emailRegister');
        emailTextField.setValue("testemail.com");

        const passwordTextField = $('#passwordRegister');
        passwordTextField.setValue("password1");

        const passwordConfirmTextField = $('#passwordRegisterConfirm');
        passwordConfirmTextField.setValue("password1");

        const registerButton = $('#registerButton');
        registerButton.click()

        const emailErrorMessage = $('#emailLogin-helper-text');
        expect(emailErrorMessage).toHaveText("The email address is badly formatted.")

    })

    it('Mismatched Password Should Not Pass Validation', function () {

        const registerHintButton = $('#registerHint');
        registerHintButton.click();

        const emailTextField = $('#emailRegister');
        emailTextField.setValue("test@email.com");

        const passwordTextField = $('#passwordRegister');
        passwordTextField.setValue("password1");

        const passwordConfirmTextField = $('#passwordRegisterConfirm');
        passwordConfirmTextField.setValue("password2");

        const registerButton = $('#registerButton');
        registerButton.click()

        const passwordErrorMessage = $('#passwordRegister-helper-text')
        const passwordConfirmErrorMessage = $('#passwordRegisterConfirm-helper-text')

        expect(passwordErrorMessage).toHaveText("Passwords Do Not Match")
        expect(passwordConfirmErrorMessage).toHaveText("Passwords Do Not Match")
    });



    it('Weak Password Should Not Pass Validation', function () {

        const registerHintButton = $('#registerHint');
        registerHintButton.click();

        const emailTextField = $('#emailRegister');
        emailTextField.setValue("test@email.com");

        const passwordTextField = $('#passwordRegister');
        passwordTextField.setValue("p1");

        const passwordConfirmTextField = $('#passwordRegisterConfirm');
        passwordConfirmTextField.setValue("p1");

        const registerButton = $('#registerButton');
        registerButton.click()

        const passwordErrorMessage = $('#passwordRegister-helper-text')

        expect(passwordErrorMessage).toHaveText("Password should be at least 6 characters")
    });

    it('Successful Registration Should Redirect To Admin Page', function() {
        const registerHintButton = $('#registerHint');
        registerHintButton.click();

        const emailTextField = $('#emailRegister');
        emailTextField.setValue("testRegister@email.com");

        const passwordTextField = $('#passwordRegister');
        passwordTextField.setValue("password");

        const passwordConfirmTextField = $('#passwordRegisterConfirm');
        passwordConfirmTextField.setValue("password");

        const registerButton = $('#registerButton');
        registerButton.click()

        expect(browser).toHaveUrl('http://localhost:3000/#/admin')

        const logoutButton = $('#loginLogoutButton');
        logoutButton.click();
    });


})

describe('Login Tests', function () {

    beforeEach(function () {
        browser.url('./');
    })

    it('Login Should Fail When Account Does Not Exist', function () {
        const emailTextField = $('#emailLogin');
        emailTextField.setValue("nonExistantAccount@email.com");

        const passwordTextField = $('#passwordLogin');
        passwordTextField.setValue("password");

        const loginButton = $('#loginButton');
        loginButton.click();

        const errorMessage = $('#emailLogin-helper-text')
        expect(errorMessage).toHaveText("There is no user record corresponding to this identifier. The user may have been deleted.")

    })

    it('Login Should Fail When Password Incorrect', function () {
        const emailTextField = $('#emailLogin');
        emailTextField.setValue("testRegister@email.com");

        const passwordTextField = $('#passwordLogin');
        passwordTextField.setValue("incorrectPassword");

        const loginButton = $('#loginButton');
        loginButton.click();

        const errorMessage = $('#passwordLogin-helper-text')
        expect(errorMessage).toHaveText("The password is invalid or the user does not have a password.")

    })

    it('SuccessFul Login Should Redirect To Admin Page', function () {
        const emailTextField = $('#emailLogin');
        emailTextField.setValue("testRegister@email.com");

        const passwordTextField = $('#passwordLogin');
        passwordTextField.setValue("password");

        const loginButton = $('#loginButton');
        loginButton.click();

        expect(browser).toHaveUrl('http://localhost:3000/#/admin')

        const logoutButton = $('#loginLogoutButton');
        logoutButton.click();
    })

    it('Clicking On Reset Password Text Should Show Reset Password Modal', function() {
        const resetPasswordHint = $('#resetPasswordHint');
        resetPasswordHint.click();

        const resetPasswordModal = $('#resetPasswordModal');
        expect(resetPasswordModal).toExist();
    })

    it('Entering Invalid Email For Password Reset Should Show Error Message', function() {
        const resetPasswordHint = $('#resetPasswordHint');
        resetPasswordHint.click();

        const emailTextField = $('#emailResetPasswordTextField');
        emailTextField.setValue("invalidEmail");

        const resetPasswordButton = $('#resetPasswordButton');
        resetPasswordButton.click();

        const emailErrorMessage = $('#emailResetPasswordTextField-helper-text');
        expect(emailErrorMessage).toHaveText("The email address is badly formatted.")
    })
    
    it('Entering Email For Non-Existant Account For Password Reset Should Show Error Message', function() {
        const resetPasswordHint = $('#resetPasswordHint');
        resetPasswordHint.click();

        const emailTextField = $('#emailResetPasswordTextField');
        emailTextField.setValue("nonExistantAccount@email.com");

        const resetPasswordButton = $('#resetPasswordButton');
        resetPasswordButton.click();

        const emailErrorMessage = $('#emailResetPasswordTextField-helper-text');
        expect(emailErrorMessage).toHaveText("There is no user record corresponding to this identifier. The user may have been deleted.")
        
    })

    it('Entering Valid Email Should Show Alert Dialog', function() {
        const resetPasswordHint = $('#resetPasswordHint');
        resetPasswordHint.click();

        const emailTextField = $('#emailResetPasswordTextField');
        emailTextField.setValue("testRegister@email.com");

        const resetPasswordButton = $('#resetPasswordButton');
        resetPasswordButton.click();

        browser.pause(1000)

        const alertText = browser.getAlertText()

        expect(alertText).toEqual('Reset Password Link Sent To Email. Please Check Your Junk Folder As Well');
    })

})

describe('Admin Tests', function () {

    beforeEach(function() {
        browser.url('./');

        const emailTextField = $('#emailLogin');
        emailTextField.setValue("testRegister@email.com");

        const passwordTextField = $('#passwordLogin');
        passwordTextField.setValue("password");

        const loginButton = $('#loginButton');
        loginButton.click();

        browser.pause(500);
    })

    afterEach(function () {
        const logoutButton = $('#loginLogoutButton');
        logoutButton.click();
    })

    it('Admin Table Is Displayed', function () {

        const mapListTable = $('#mapListTable');
        expect(mapListTable).toExist();

    })

    it('Create New Map Button Should Redirect To Create Map Page', function () {
        browser.pause(1000)
        const createMapLink = $('#createMapLink')
        createMapLink.click()

        expect(browser).toHaveUrl('http://localhost:3000/#/createmap')

    })

    it('Created Map Should Be Shown In Admin Table', function() {
        
        const createMapLink = $('#createMapLink')
        createMapLink.click()

        const createBuildingButton = $('#createBuilding')
        createBuildingButton.click();

        const createPathButton = $('#createPath')
        createPathButton.click();

        const nextStepLink = $('#nextStepLink')
        nextStepLink.click();
        nextStepLink.click();

        const newMapNameTextField = $('#mapNameTextField');
        newMapNameTextField.setValue("New Map Name");

        const createMapButton = $('#createMapButton');
        createMapButton.click()

        browser.pause(500)

        const mapRow = $('#mapRow0');
        expect(mapRow).toExist()

    })

    it('Edit Button Should Redirect To Create Map Page', function() {
        const editMapButton = $('#mapRow0EditButton')
        editMapButton.click();

        browser.pause(500)

        expect(browser).toHaveUrl('http://localhost:3000/#/createmap')

    })

    it('Map Should Be Deleted When Delete Button Clicked', function() {
        const deleteMapButton = $('#mapRow0DeleteButton')
        deleteMapButton.click()

        const mapRow = $('#mapRow0');
        mapRow.waitForExist({ reverse: true });

    })

})

describe("View Map Page Tests", function() {
    beforeEach(function() {

        browser.url('./#viewmap');
        browser.pause(500);

    })

    it("Enter Code Modal Should Be Shown", function() {

        const enterCodeModal = $('#enterCodeModal')
        expect(enterCodeModal).toExist()

    })

    it("Map Code Not 6 Digits In Length Should Show Error", function() {
        const mapCodeTextField = $('#enterMapCode');
        mapCodeTextField.setValue("123");

        const retrieveMapButton = $('#retrieveMap')
        retrieveMapButton.click()

        const mapCodeError = $('#enterMapCode-helper-text');
        expect(mapCodeError).toHaveText("Invalid Map Code")
    })

    it("Invalid 6 Digits In Length Should Show Error", function() {
        const mapCodeTextField = $('#enterMapCode');
        mapCodeTextField.setValue("123456");

        const retrieveMapButton = $('#retrieveMap')
        retrieveMapButton.click()

        const mapCodeError = $('#enterMapCode-helper-text');
        expect(mapCodeError).toHaveText("Map not Found")
    })
})