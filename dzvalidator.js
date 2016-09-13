(function ($) {
    var adapters = [
        {
            name:'required',
            validator:function($obj){
                return $obj.val() != '';
            }
        },
        {
            name:'regex',
            validator:function($obj) {
                var reg = new RegExp($obj.attr('dz-regex-pattern'));
                return reg.test($obj.val());
            }
        },
        {
            name:'range',
            validator:function($obj) {
                var min = $obj.attr('dz-range-min');
                var max = $obj.attr('dz-range-max');
                var value = parseFloat($obj.val());
                if (!!min && value < min) {
                    return false;
                }

                if (!!max && value > max) {
                    return false;
                }

                return true;
            }
        }
    ];

    var validateRules = {};
    var customRules = [];

    function validateAll() {
        $.each(validateRules, function () {
            validateRuleList(this);
        });
        $.each(customRules, function () {
            if (!this.validator()) {
                $('[dz-for="' + this.name + '"]')
                    .addClass(defaultOptions.errorClass)
                    .html(this.msg)
                    .show();
            }
        })
    }

    function validateRuleList(ruleList) {
        var hasError = false;
        var errorObj = null;
        $.each(ruleList, function() {
            var result = this.validator(this.obj);
            errorObj = this.errorObj;
            if (result == false) {
                errorObj.addClass(defaultOptions.errorClass).html(this.msg).show();
                hasError = true;
                return false;
            }
        });

        if (!hasError) {
            errorObj.hide();
        }

    }

    $(function(){
        $('input[dz-validation="true"]').each(function(){
            var $obj = $(this);
            validateRules[$obj.attr('name')] = [];
            $.each(adapters, function(){
                var attrValue = $obj.attr('dz-' + this.name);
                if ((!!attrValue) != false) {
                    validateRules[$obj.attr('name')].push({
                        name: $obj.attr('name'),
                        msg: attrValue,
                        validator: this.validator,
                        obj: $obj,
                        errorObj: $('[dz-for="' + $obj.attr('name') + '"]')
                    });
                }
            });

            $obj.on('focusout', function(){
                validateRuleList(validateRules[$obj.attr('name')]);
            }).on('keyup', function(){
                validateRuleList(validateRules[$obj.attr('name')]);
            });

        });
    });

    var defaultOptions = {
        errorClass : 'dz-error'
    };

    jQuery.extend({
        dzValidator : {
            setOptions : function(options) {
                defaultOptions = $.extend({}, defaultOptions, options);
            },
            validate : function() {
                validateAll();
            },
            addRule : function(ruleName, ruleMsg, ruleValidator) {
                customRules.push({
                    name : ruleName,
                    msg : ruleMsg,
                    validator: ruleValidator
                });
            }
        }
    });

}(jQuery));