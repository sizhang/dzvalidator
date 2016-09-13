(function ($) {
    var adapters = [
        {
            name: 'required',
            validator: function ($obj) {
                return $.trim($obj.val()) != '';
            }
        },
        {
            name: 'regex',
            validator: function ($obj) {
                var reg = new RegExp($obj.attr(defaultOptions.prefix + 'regex-pattern'));
                return reg.test($obj.val());
            }
        },
        {
            name: 'range',
            validator: function ($obj) {
                var min = $obj.attr(defaultOptions.prefix + 'range-min');
                var max = $obj.attr(defaultOptions.prefix + 'range-max');
                var value = parseFloat($obj.val());
                if (!!min && value < min) {
                    return false;
                }

                if (!!max && value > max) {
                    return false;
                }

                return true;
            }
        },
        {
            name: 'equal',
            validator: function($obj) {
                return $obj.val() == $('input[name="' + $obj.attr(defaultOptions.prefix + 'equal-target') + '"]').val();
            }
        }
    ];

    var validateRules = {};
    var customRules = [];

    /**
     * validate all the input rules and custom validation rules
     * @returns {boolean}
     */
    function validateAll() {

        var hasErrors = false;
        $.each(validateRules, function () {
            var hasError = validateRuleList(this);
            if (hasError) {
                hasErrors = true;
            }
        });

        $.each(customRules, function () {
            if (!this.validator()) {
                $('[dz-for="' + this.name + '"]')
                    .html(this.msg)
                    .show();
                hasErrors = true;
            }
        });

        if (hasErrors) {
            return false;
        } else {
            return true;
        }

    }

    /**
     * validate rules belonging to an input
     * @param ruleList
     * @returns {boolean}
     */
    function validateRuleList(ruleList) {
        var hasError = false;
        var errorObj = null;
        $.each(ruleList, function () {
            var result = this.validator(this.obj);
            errorObj = this.errorObj;
            if (result == false) {
                errorObj.html(this.msg).show();
                hasError = true;
                return false;
            }
        });

        if (hasError) {
            return false;
        } else {
            errorObj.hide();
            return true;
        }

    }

    /**
     * parse all the inputs with validation rules and install validation events
     */
    function parseElements() {
        $('input[' + defaultOptions.prefix + 'validation="true"]').each(function () {
            var $obj = $(this);
            var objName = $obj.attr('name');
            $('[' + defaultOptions.prefix + 'for="' + objName + '"]').addClass(defaultOptions.errorClass).hide();
            validateRules[objName] = [];
            $.each(adapters, function () {
                var attrValue = $obj.attr(defaultOptions.prefix + this.name);
                if ((!!attrValue) != false) {
                    validateRules[objName].push({
                        name:objName,
                        msg: attrValue,
                        validator: this.validator,
                        obj: $obj,
                        errorObj: $('[' + defaultOptions.prefix + 'for="' + objName + '"]')
                    });
                }
            });

            $obj.on('focusout', function () {
                validateRuleList(validateRules[objName]);
            }).on('keyup', function () {
                validateRuleList(validateRules[objName]);
            });

        });
    }

    var defaultOptions = {
        errorClass: 'dz-error',
        prefix: 'dz-'
    };

    jQuery.extend({
        dzValidator: {
            setOptions: function (options) {
                defaultOptions = $.extend({}, defaultOptions, options);
            },
            validate: function () {
                return validateAll();
            },
            addRule: function (ruleName, ruleMsg, ruleValidator) {
                customRules.push({
                    name: ruleName,
                    msg: ruleMsg,
                    validator: ruleValidator
                });
            },
            //usually used to show corresponding errors from ajax response
            showErrorMsgs: function(errors) {
                $('.' + defaultOptions.errorClass).hide();
                for (var key in errors) {
                    if (errors[key] instanceof Array) {
                        $('[' + defaultOptions.prefix + 'for="' + key + '"]').html(errors[key].join(';')).show();
                    } else {
                        $('[' + defaultOptions.prefix + 'for="' + key + '"]').html(errors[key]).show();
                    }
                }
            }
        }
    });

    $(function(){
        parseElements();
    });

}(jQuery));