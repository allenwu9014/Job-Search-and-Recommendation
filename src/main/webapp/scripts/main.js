(function() {
    // get all elements
    var oAvatar = document.getElementById('avatar'),
        oWelcomeMsg = document.getElementById('welcome-msg'),
        oLogoutBtn = document.getElementById('logout-link'),
        oRegisterFormBtn = document.getElementById('register-form-btn'),
        oLoginBtn = document.getElementById('login-btn'),
        oLoginForm = document.getElementById('login-form'),
        oLoginUsername = document.getElementById('username'),
        oLoginPwd = document.getElementById('password'),
        oLoginFormBtn = document.getElementById('login-form-btn'),
        oLoginErrorField = document.getElementById('login-error'),
        oRegisterBtn = document.getElementById('register-btn'),
        oRegisterUsername = document.getElementById('register-username'),
        oRegisterPwd = document.getElementById('register-password'),
        oRegisterFirstName = document.getElementById('register-first-name'),
        oRegisterLastName = document.getElementById('register-last-name'),
        oRegisterForm = document.getElementById('register-form'),
        oRegisterResultField = document.getElementById('register-result'),
        oNearbyBtn = document.getElementById('nearby-btn'),
        oRecommendBtn = document.getElementById('recommend-btn'),
        oNavBtnList = document.getElementsByClassName('main-nav-btn'),
        oItemNav = document.getElementById('item-nav'),
        oItemList = document.getElementById('item-list'),
        userId = '1111',
        userFullName = 'John',
        lng = -122.08,
        lat = 37.38;

    // init
    function init() {
        // validate session
        validateSession();
        // bind event
        bindEvent();
    }

    function validateSession() {
        switchLoginRegister('login');
    }

    function bindEvent() {
        // switch between login and register
        oRegisterFormBtn.addEventListener('click', function(){
            switchLoginRegister('register')
        }, false);
        oLoginFormBtn.addEventListener('click', function() {
            switchLoginRegister('login')
        }, false);

        // click login button
        oLoginBtn.addEventListener('click', loginExecutor, false);

        // click register button
        oRegisterBtn.addEventListener('click', registerExecutor, false);
    }

    function loginExecutor() {
        var username = oLoginUsername.value,
            password = oLoginPwd.value;

        if (username === "" || password == "") {
            oLoginErrorField.innerHTML = 'Please fill in all fields';
            return;
        }
        password = md5(username + md5(password));

        ajax({
            method: 'POST',
            url: './login',
            data: {
                user_id: username,
                password: password,
            },
            success: function (res) {
                // case1: login success
                if (res.status === 'OK') {
                    console.log('login')
                    console.log(res);
                    // show welcome message
                    welcomeMsg(res);
                    // fetch data
                    fetchData();
                } else {
                    // case2: login failed
                    oLoginErrorField.innerHTML = 'Invalid username or password';
                }
            },
            error: function () {
                //show login error
                throw new Error('Invalid username or password');
            }
        })
    }


    function registerExecutor() {
        console.log('register');
        var username = oRegisterUsername.value,
            password = oRegisterPwd.value,
            firstName = oRegisterFirstName.value,
            lastName = oRegisterLastName.value;
        console.log(username, password,firstName, lastName);

        if (username === "" || password == "" || firstName === ""
            || lastName === "") {
            oRegisterResultField.innerHTML = 'Please fill in all fields';
            return;
        }

        if (username.match(/^[a-z0-9_]+$/) === null) {
            oRegisterResultField.innerHTML = 'Invalid username';
            return;
        }
        password = md5(username + md5(password));
        ajax({
            method: 'POST',
            url: './register',
            data: {
                user_id : username,
                password : password,
                first_name : firstName,
                last_name : lastName,
            },
            success: function (res) {
                if (res.status === 'OK' || res.result === 'OK') {
                    oRegisterResultField.innerHTML = 'Successfully registered!'
                } else {
                    oRegisterResultField.innerHTML = 'User already existed!'
                }
            },
            error: function () {
                //show login error
                throw new Error('Failed to register');
            }
        })

    }

    function switchLoginRegister(name) {
        // hide header elements
        showOrHideElement(oAvatar, 'none');
        showOrHideElement(oWelcomeMsg, 'none');
        showOrHideElement(oLogoutBtn, 'none');

        // hide item list area
        showOrHideElement(oItemNav, 'none');
        showOrHideElement(oItemList, 'none');

        if(name === 'login') {
            // hide register form
            showOrHideElement(oRegisterForm, 'none');
            // clear register error
            oRegisterResultField.innerHTML = ''

            // show login form
            showOrHideElement(oLoginForm, 'block');

        } else {
            // hide login form
            showOrHideElement(oLoginForm, 'none');
            // clear login error if existed
            oLoginErrorField.innerHTML = '';

            // show register form
            showOrHideElement(oRegisterForm, 'block');
        }
    }

    function showOrHideElement(ele, style) {
        ele.style.display = style;
    }

    function ajax(opt) {
        var opt = opt || {},
            method = (opt.method || 'GET').toUpperCase(),
            url = opt.url,
            data = opt.data || null,
            success = opt.success || function () {
            },
            error = opt.error || function () {
            },
            xhr = new XMLHttpRequest();

        if (!url) {
            throw new Error('missing url');
        }

        xhr.open(method, url, true);

        if (!data) {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.send(JSON.stringify(data));
        }

        xhr.onload = function () {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText))
            } else {
                error()
            }
        }

        xhr.onerror = function () {
            throw new Error('The request could not be completed.')
        }
    }

    init();
})();