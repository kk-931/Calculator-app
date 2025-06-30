"use strict"; 
{
    let isResult = false;
    let isLongPressed = false;
    let longPressTimer;

    function checkOverflow() {
        const display = document.getElementById("display");
        if (display.scrollWidth > display.clientWidth) {
            $("#display").text("Error");
            isResult = true;
            $("#backspace-button").text("C")
        }
    }

    $("button").on("click", function(){
        if (isLongPressed) {
            isLongPressed = false;
            return;
        }

        let current = $("#display").text();
        let next = $(this).text();

        if (next === "*") next = "×";
        if (next === "/") next = "÷";

        if (current === "Error" && next !== "⌫" && next !== "C") return; 

        if (next === "⌫" || next === "C") {
            if (isResult || next === "C") {
                $("#display").text("0");
                $("#backspace-button").text("⌫");
                isResult = false
            } else {
            if (current.length > 1) {
                $("#display").text(current.slice(0, -1));
            } else {
                $("#display").text("0");
                }
            }
            return;
        }

        if (next === "−") next = "-";
        if (next === "×") next = "*";
        if (next === "÷") next = "/";

        if (next === "=") {
            let expression = current
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

            let result = eval(expression);
            $("#display").text(result);
            $("#backspace-button").text("C");
            isResult = true;
            checkOverflow();
            return;
        }
        
        let displayChar = next;

        if (next === "*")displayChar = "×";
        else if (next === "/") displayChar = "÷";
        

        if (isResult) {
            if (/\d/.test(next)) {
                $("#display").text(displayChar);
                isResult = false;
                $("#backspace-button").text("⌫");
                return;
            } else if (["+", "-", "×", "÷"].includes(displayChar)) {
                $("#display").text(current + displayChar);
                isResult = false;
                return;
            }
        } else {
            if (current ==="0" && /\d/.test(next)) {
                $("#display").text(displayChar);
            } else {
                $("#display").text(current + displayChar);
                checkOverflow();
            }
        }
    });

    $(document).on("keydown", function(e) {
        let key = e.key;
        let nextChar = key;

        if (key === "-") nextChar = "-";
        if (key === "*") nextChar = "×";
        if (key === "/") nextChar = "÷";

        let $target

        if ("0123456789+-×÷".includes(nextChar)) {
            if (key === "*") key = "×";
            if (key === "/") key = "÷";
            $target = $("button").filter(function(){
                return $(this).text() === nextChar;
            });
            $target.trigger("click");
        }

        if (key === "Enter"){
            $target = $("button").filter(function() {
                return $(this).text() === "=";
            });
            $target.trigger("click");
        }

        if (key === "Backspace" || key === "Delete") {
            $target = $("#backspace-button");
            $target.trigger("click");
            e.preventDefault();
        }

        if ($target && $target.length) {
            $target.addClass("active");
            setTimeout(function() {
                $target.removeClass("active");
            }, 100);
        }
    });
}