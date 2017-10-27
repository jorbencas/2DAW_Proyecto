app.controller('contactCtrl', function ($scope, services) {
   console.log($scope);
    $scope.contact = {
        inputName: "",
        inputEmail: "",
        inputSubject: "",
        inputMessage: ""
    };

    $scope.SubmitContact = function () {
        var data = {"inputName": $scope.contact.inputName, "inputEmail": $scope.contact.inputEmail, "inputSubject": $scope.contact.inputSubject, "inputMessage": $scope.contact.inputMessage,"token":'contact_form'};
        var contact_form = JSON.stringify(data);
        services.post('contact', 'process_contact', contact_form).then(function (response) {
            response = response.split("|");
            $scope.message = response[1];
            if (response[0].substring(1,5) == 'true') {
                $scope.class = 'alert alert-success';
            } else {
                $scope.class = 'alert alert-error';
            }
        });
    };
});
