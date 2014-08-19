///<reference path="./packages/jQuery.1.8.2/Content/Scripts/jquery-1.8.2.js"/>
///<reference path="./packages/jQuery.Validation.1.10.0/Content/Scripts/jquery.validate.js"/>
///<reference path="./packages/Microsoft.jQuery.Unobtrusive.Validation.3.1.1/Content/Scripts/jquery.validate.unobtrusive.js"/>
///<reference path="./expressive.annotations.validate.js"/>

//debugger; // enable firebug (preferably, check 'on for all web pages' option) for the debugger to launch 
(function($, window, ea) { //scoping function (top-level, usually anonymous, prevents global namespace pollution)

    window.module("type helper");

    test("verify_string_formatting", function() {
        window.equal(ea.typeHelper.string.format("{0}", "a"), "a");
        window.equal(ea.typeHelper.string.format("{0}{1}", "a", "b"), "ab");
        window.equal(ea.typeHelper.string.format("{0}{0}", "a", "b"), "aa");
        window.equal(ea.typeHelper.string.format("{0}{0}", "a"), "aa");

        window.equal(ea.typeHelper.string.format("{0}", ["a"]), "a");
        window.equal(ea.typeHelper.string.format("{0}{1}", ["a", "b"]), "ab");
        window.equal(ea.typeHelper.string.format("{0}{0}", ["a", "b"]), "aa");
        window.equal(ea.typeHelper.string.format("{0}{0}", ["a"]), "aa");
    });

    test("verify_string_parsing", function() {
        window.equal(ea.typeHelper.string.tryParse("abc"), "abc");
        window.equal(ea.typeHelper.string.tryParse(123), "123");
        window.equal(ea.typeHelper.string.tryParse(false), "false");

        var result = ea.typeHelper.string.tryParse(undefined);
        window.equal(result.error, true);
        window.equal(result.msg, "Parsing error. Given value has no string meaning.");
    });

    test("verify_bool_parsing", function() {
        window.equal(ea.typeHelper.bool.tryParse(false), false);
        window.equal(ea.typeHelper.bool.tryParse("false"), false);
        window.equal(ea.typeHelper.bool.tryParse("False"), false);
        window.equal(ea.typeHelper.bool.tryParse(true), true);
        window.equal(ea.typeHelper.bool.tryParse("true"), true);
        window.equal(ea.typeHelper.bool.tryParse("True"), true);

        var result = ea.typeHelper.bool.tryParse("asd");
        window.equal(result.error, true);
        window.equal(result.msg, "Parsing error. Given value has no boolean meaning.");
    });

    test("verify_float_parsing", function() {
        // integer literals
        window.equal(ea.typeHelper.float.tryParse("-1"), -1); // negative integer string
        window.equal(ea.typeHelper.float.tryParse("0"), 0); // zero string
        window.equal(ea.typeHelper.float.tryParse("1"), 1); // positive integer string
        window.equal(ea.typeHelper.float.tryParse(-1), -1); // negative integer number
        window.equal(ea.typeHelper.float.tryParse(0), 0); // zero integer number
        window.equal(ea.typeHelper.float.tryParse(1), 1); // positive integer number
        window.equal(ea.typeHelper.float.tryParse(0xFF), 255); // hexadecimal integer literal

        // floating-point literals
        window.equal(ea.typeHelper.float.tryParse("-1.1"), -1.1); // negative floating point string
        window.equal(ea.typeHelper.float.tryParse("1.1"), 1.1); // positive floating point string
        window.equal(ea.typeHelper.float.tryParse(-1.1), -1.1); // negative floating point number
        window.equal(ea.typeHelper.float.tryParse(1.1), 1.1); // positive floating point number
        window.equal(ea.typeHelper.float.tryParse("314e-2"), 3.14); // exponential notation string 
        window.equal(ea.typeHelper.float.tryParse(314e-2), 3.14); // exponential notation

        // non-numeric valuer
        var result = ea.typeHelper.float.tryParse(""); // empty string
        window.equal(result.error, true);
        window.equal(result.msg, "Parsing error. Given value has no numeric meaning.");

        window.ok(ea.typeHelper.float.tryParse(" ").error); // whitespace character
        window.ok(ea.typeHelper.float.tryParse("\t").error); // tab characters
        window.ok(ea.typeHelper.float.tryParse("asd").error); // non-numeric character string
        window.ok(ea.typeHelper.float.tryParse("true").error); // boolean true
        window.ok(ea.typeHelper.float.tryParse("false").error); // boolean false
        window.ok(ea.typeHelper.float.tryParse("asd123").error); // number with preceding non-numeric characters
        window.ok(ea.typeHelper.float.tryParse("123asd").error); // number with trailling non-numeric characters
        window.ok(ea.typeHelper.float.tryParse(undefined).error); // undefined value
        window.ok(ea.typeHelper.float.tryParse(null).error); // null value
        window.ok(ea.typeHelper.float.tryParse(NaN).error); // NaN value
        window.ok(ea.typeHelper.float.tryParse(Infinity).error); // infinity primitive
        window.ok(ea.typeHelper.float.tryParse(+Infinity).error); // positive Infinity
        window.ok(ea.typeHelper.float.tryParse(-Infinity).error); // negative Infinity
        window.ok(ea.typeHelper.float.tryParse(new Date(Date.now())).error); // date object
        window.ok(ea.typeHelper.float.tryParse({}).error); // empty object
    });

    test("verify_date_parsing", function() {
        var now = Date.now();
        window.deepEqual(ea.typeHelper.date.tryParse(new Date(now)), new Date(now));
        window.deepEqual(ea.typeHelper.date.tryParse("Wed, 09 Aug 1995 00:00:00 GMT"), new Date(807926400000));
        window.deepEqual(ea.typeHelper.date.tryParse("Thu, 01 Jan 1970 00:00:00 GMT"), new Date(0));
        window.deepEqual(ea.typeHelper.date.tryParse("Thu, 01 Jan 1970 00:00:00 GMT-0400"), new Date(14400000));

        var result = ea.typeHelper.date.tryParse("");
        window.equal(result.error, true);
        window.equal(result.msg, "Parsing error. Given value is not a string representing an RFC 2822 or ISO 8601 date.");
    });

    test("verify_numeric_recognition", function() {
        window.ok(ea.typeHelper.isNumeric(1));
        window.ok(!ea.typeHelper.isNumeric(NaN));
        window.ok(!ea.typeHelper.isNumeric("1"));
    });

    test("verify_date_recognition", function() {
        window.ok(ea.typeHelper.isDate(new Date("Wed, 09 Aug 1995 00:00:00 GMT")));
        window.ok(!ea.typeHelper.isDate("Wed, 09 Aug 1995 00:00:00 GMT"));
        window.ok(!ea.typeHelper.isDate(807926400000));
    });

    test("verify_string_recognition", function() {
        window.ok(ea.typeHelper.isString(""));
        window.ok(ea.typeHelper.isString("123"));
        window.ok(!ea.typeHelper.isString(123));
        window.ok(!ea.typeHelper.isString({}));
        window.ok(!ea.typeHelper.isString(null));
        window.ok(!ea.typeHelper.isString(undefined));
    });

    test("verify_bool_recognition", function() {
        window.ok(ea.typeHelper.isBool(true));
        window.ok(!ea.typeHelper.isBool("true"));
        window.ok(!ea.typeHelper.isBool(0));
    });

    window.module("model helper");

    test("verify_model_evaluation", function() {
        var model = ea.modelHelper.deserializeObject(null, null, { "Number": 123, "Stability.High": 0 }, null);
        with (model) {
            window.ok(eval("IsNumber(Number) && Number - 23 == 100 && Stability.High == 0"));
        }
    });

    window.module("toolchain");

    test("verify_toolchain_methods", function() {

        var o = {};
        ea.toolchain.registerMethods(o);
        var m = ea.toolchain.methods;
        var tomorrow = m.Today();
        tomorrow.setDate(tomorrow.getDate() + 1);

        window.ok(m.Now() > m.Today());
        window.ok(m.Length('1234') == 4);
        window.ok(m.Trim(' a b c ') == 'a b c');
        window.ok(m.Concat(' a ', ' b ') == ' a  b ');
        window.ok(m.Concat('', '', '') == '');
        window.ok(m.CompareOrdinal(' abc ', ' ABC ') > 0);
        window.ok(m.CompareOrdinalIgnoreCase(' abc ', ' ABC ') == 0);
        window.ok(m.StartsWith(' ab c', ' A') == false);
        window.ok(m.StartsWithIgnoreCase(' ab c', ' A') == true);
        window.ok(m.EndsWith(' ab c', ' C') == false);
        window.ok(m.EndsWithIgnoreCase(' ab c', ' C') == true);
        window.ok(m.Contains(' ab c', 'B ') == false);
        window.ok(m.ContainsIgnoreCase(' ab c', 'B ') == true);
        window.ok(m.IsNullOrWhiteSpace('    ') == true);
        window.ok(m.IsDigitChain('0123456789') == true);
        window.ok(m.IsNumber('-0.3e-2') == true);
        window.ok(m.IsEmail('nickname@domain.com') == true);
        window.ok(m.IsUrl('http://www.github.com/') == true);
        window.ok(m.IsRegexMatch('-0.3e-2', '^[\\+-]?\\d*\\.?\\d+(?:[eE][\\+-]?\\d+)?$') == true);
        window.ok(m.IsSameDate(m.Now(), m.Today()) == true);
        window.ok(m.IsSameDate(m.Today(), tomorrow) == false);
    });

}($, window, window.ea.___6BE7863DC1DB4AFAA61BB53FF97FE169));
