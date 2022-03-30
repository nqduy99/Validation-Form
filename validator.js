
// Validator function
function Validator(options) {

    var selectorRule = {};

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage

        // Lấy ra các rules của selector
        var rules = selectorRule[rule.selector];

        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm qua
        for(var i = 0; i< rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) {
                break;
            }
        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage;
    }

    //Lay Element cua form can validate
    var formElement = document.querySelector(options.form)

    if(formElement) {
        // Loại bỏ hành vi mặc định khi Submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            
            // Lặp qua từng rule và validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false;
                }
            })

            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values;
                    }, {})
                    console.log(formValues)
                    options.onSubmit({
                        name: 'Son Dang'
                    })
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input)
        options.rules.forEach(function(rule) {
            // Lưu lại các rule cho các input
            if(Array.isArray(selectorRule[rule.selector])) {
                selectorRule[rule.selector].push(rule.test)
            } else {
                selectorRule[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector)
            
            if(inputElement) {
                // Xử lý trường hợp blur ra khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule)

                }

                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message')
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

//Define Rules
//Nguyên tắc của các rule
// 1. Khi có lỗi thì trả ra message lỗi 
// 2. Khi hợp lệ thì không trả ra gì cả 
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này!'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var reject = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            return reject.test(value) ? undefined : message || 'Trường này phải là email!'
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min  ? undefined : message || `Vui lòng nhập mật khẩu tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue()  ? undefined : message || `Giá trị nhập vào không chính xác`
        }
    }
}