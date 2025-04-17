angular.module('authApp', [])
.controller('AuthController', function($http, $window, $location) {
    var vm = this;

    // Registration
    vm.user = {
        username: '',
        email: '',
        password: ''
    };

    vm.register = function() {
        // Save to JSON Server
        $http.post('http://localhost:3000/users', vm.user)
            .then(function(response) {
                console.log('User saved to JSON Server:', response.data);

                // Save to LocalStorage
                var users = JSON.parse($window.localStorage.getItem('users') || '[]');
                users.push(vm.user);
                $window.localStorage.setItem('users', JSON.stringify(users));

                alert('Registration successful!');
                $location.path('/login.html'); // Redirect to login page
            })
            .catch(function(error) {
                console.error('Error saving user:', error);
                alert('Registration failed. Please try again.');
            });
    };

    // Login
    vm.loginData = {
        email: '',
        password: ''
    };

    vm.login = function() {
        // Check in JSON Server
        $http.get('http://localhost:3000/users?email=' + vm.loginData.email)
            .then(function(response) {
                var users = response.data;
                if (users.length > 0 && users[0].password === vm.loginData.password) {
                    alert('Login successful!');
                    $window.localStorage.setItem('currentUser', JSON.stringify(users[0]));
                    $location.path('/dashboard.html'); // Redirect to dashboard (not implemented here)
                } else {
                    alert('Invalid email or password.');
                }
            })
            .catch(function(error) {
                console.error('Error logging in:', error);
                alert('Login failed. Please try again.');
            });
    };
});