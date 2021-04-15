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

})




