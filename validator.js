
// Validator function
function Validator(options) {
    var formElement = document.querySelector(options.form)

    if(formElement) {

        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector)
            console.log(inputElement)
            if(inputElement) {
                inputElement.onblur = function () {
                    console.log(inputElement.value)
                }
            }
        })
    }
}

//Define Rules
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function() {

        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function() {

        }
    }
}