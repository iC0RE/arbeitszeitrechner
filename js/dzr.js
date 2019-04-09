$(document).ready(function () {

    $("#30").click(function () {
        $("#soll").val("06:00");
        $("#30").addClass("active");
        $("#35, #39, #40, #41").removeClass("active");
        calculate();
    })
    $("#35").click(function () {
        $("#soll").val("07:00");
        $("#35").addClass("active");
        $("#30, #39, #40, #41").removeClass("active");
        calculate();
    })
    $("#39").click(function () {
        $("#soll").val("07:48");
        $("#39").addClass("active");
        $("#30, #35, #40, #41").removeClass("active");
        calculate();
    })
    $("#40").click(function () {
        $("#soll").val("08:00");
        $("#40").addClass("active");
        $("#30, #35, #39, #41").removeClass("active");
        calculate();
    })
    $("#41").click(function () {
        $("#soll").val("08:12");
        $("#41").addClass("active");
        $("#30, #35, #39, #40").removeClass("active");
        calculate();
    })
    $("#00min").click(function () {
        $("#pause").val("00:00");
        $(this).addClass("active");
        $("#30min, #45min").removeClass("active");
        calculate();
    })
    $("#30min").click(function () {
        $("#pause").val("00:30");
        $(this).addClass("active");
        $("#00min, #45min").removeClass("active");
        calculate();
    })
    $("#45min").click(function () {
        $("#pause").val("00:45");
        $(this).addClass("active");
        $("#00min, #30min").removeClass("active");
        calculate();
    })

    $("#default").click(function () {
        $("#default").addClass("active");
        $("#winter").removeClass("active");
    })

    $("#winter").click(function () {
        $("#winter").addClass("active");
        $("#default").removeClass("active");
    })

    // liest Dienstbeginn aus dem Input-Feld aus
    function getStart_time() {
        var start_time = $("#start").val().split(":");

        var start_hours = parseInt(start_time[0], 10);
        var start_mins = parseInt(start_time[1], 10);

        start_time = [start_hours, start_mins];
        return start_time;
    }

    // liest Dienstende aus dem Input-Feld aus
    function getEnd_time() {
        var end_time = $("#end").val().split(":");

        var end_hours = parseInt(end_time[0], 10);
        var end_mins = parseInt(end_time[1], 10);

        end_time = [end_hours, end_mins];
        return end_time;
    }

    // Gibt die Differenz zwischen Start und Ende zurück
    function getDiff_time() {
        var start_time = getStart_time();
        var end_time = getEnd_time();

        var start_hours = parseInt(start_time[0], 10);
        var start_mins = parseInt(start_time[1], 10);
        var end_hours = parseInt(end_time[0], 10);
        var end_mins = parseInt(end_time[1], 10);

        var diff_hours = end_hours - start_hours;
        var diff_mins = end_mins - start_mins;

        // Bei negativer Differenz: + 60 min & -1h
        if (diff_mins < 0) {
            diff_hours--;
            diff_mins = diff_mins + 60;
        }
        var diff_time = [diff_hours, diff_mins];
        return diff_time;
    }

    // liest Pausenzeit aus dem Input-Feld aus
    function getPause_time() {
        var pause_time = $("#pause").val().split(":");

        var pause_hours = parseInt(pause_time[0], 10);
        var pause_mins = parseInt(pause_time[1], 10);

        pause_time = [pause_hours, pause_mins];
        return pause_time;
    }

    // liest Solldienstzeit aus dem Input-Feld aus
    function getSoll_time() {
        var soll_time = $("#soll").val().split(":");

        var soll_hours = parseInt(soll_time[0], 10);
        var soll_mins = parseInt(soll_time[1], 10);

        soll_time = [soll_hours, soll_mins];
        return soll_time;
    }

    // Berechnet die reine Arbeitszeit (abzüglich Pause)
    function getWork_time() {
        var pause_time = getPause_time();
        var diff_time = getDiff_time();

        var diff_hours = diff_time[0];
        var diff_mins = diff_time[1];
        var pause_hours = pause_time[0];
        var pause_mins = pause_time[1];

        var work_hours = diff_hours - pause_hours;
        var work_mins = diff_mins - pause_mins;

        if (work_mins < 0) {
            work_hours--;
            work_mins = work_mins + 60;
        }

        var work_time = [work_hours, work_mins];
        return work_time;
    }

    // Berechnet die Differenz zwischen IST und SOLL
    function getTimeDifference() {
        var soll_time = getSoll_time();
        var work_time = getWork_time();

        var work_hours = work_time[0];
        var work_mins = work_time[1];
        var soll_hours = soll_time[0];
        var soll_mins = soll_time[1];

        var diff_hours = work_hours - soll_hours;
        // Wenn Diff-Stunden = 0 & Arbeitsminuten > Sollminuten
        if (diff_hours == 0 && work_mins > soll_mins) {
            var diff_mins = work_mins - soll_mins;
            // Wenn Diff-Stunden > 0
        } else if (diff_hours > 0) {
            var diff_mins = 60 - soll_mins + work_mins;
            diff_hours--;
            // Wenn Diff-Minuten >= 60
            if (diff_mins >= 60) {
                diff_mins = diff_mins - 60;
                diff_hours++;
            }
            // Sonst
        } else {
            // Wenn Arbeitsminuten zwischen Sollminuten und 60 ziehe von 60 Minuten die Arbeitsminuten ab und addiere die Sollminuten
            if (work_mins > soll_mins && work_mins < 60) {
                var diff_mins = 60 - work_mins + soll_mins;
                diff_hours++;
            } else {
                var diff_mins = soll_mins - work_mins;
            }
        }


        if (diff_mins < 0) {
            diff_hours--;
            diff_mins = diff_mins + 60;
        }

        if (work_hours == soll_hours && work_mins < soll_mins || work_hours < soll_hours) {
            var positive = false;
        } else {
            var positive = true;
        }

        var diff_time = [diff_hours, diff_mins, positive];
        return diff_time;
    }

    // Berechnet die Differenz zwischen Arbeitszeit und Sollzeit in Prozent
    function getPercentage() {
        var work_time = getWork_time();
        var soll_time = getSoll_time();

        var work_hours = work_time[0];
        var work_mins = work_time[1];
        var soll_hours = soll_time[0];
        var soll_mins = soll_time[1];

        work_mins = work_hours * 60 + work_mins;
        soll_mins = soll_hours * 60 + soll_mins;

        //var percentage = Math.round(work_mins*100/soll_mins,2);
        var percentage = (work_mins * 100 / soll_mins).toFixed(2);

        return percentage;
    }


    // Setzt den Standard-Wert für die Pausenzeit
    function setDefault() {
        $('#pause').val("00:30");
    }

    $("#choose_time").click(function () {
        setSoll_time;
    })

    $("#pause").focusin(function () {
        // Wenn Input leer, dann setDefault ausführen
        if (jQuery(this).val() == "") {
            setDefault();
        }
    });

    $("#end").focusin(function () {
        set_end();
        calculate();
        setCountdown();
    });

    $("#start").change(function () {
        set_end();
        calculate();
        setCountdown();
    });

    $("#pause").change(function () {
        calculate();
    });

    $("#end").change(function () {
        calculate();
        setCountdown();
    });

    $("#soll").change(function () {
        calculate();
    });

    $("#panel-btn").click(function () {
        $("#panel-content").css("display", "block");
    });


    var curr_time = $.now();

    function formatTimeOfDay(millisSinceEpoch) {
        var secondsSinceEpoch = (millisSinceEpoch / 1000) | 0;
        var secondsInDay = ((secondsSinceEpoch % 86400) + 86400) % 86400;
        var seconds = secondsInDay % 60;
        var minutes = ((secondsInDay / 60) | 0) % 60;
        // +1 für Winterzeit
        var hours = (secondsInDay / 3600 + 1) | 0;
        return hours + (minutes < 10 ? ":0" : ":") +
            minutes + (seconds < 10 ? ":0" : ":") +
            seconds;
    }

    function setCountdown() {
        // gibt das aktuelle Kalenderjahr zurück
        var curr_year = new Date().getFullYear();
        // gibt den aktuellen Monat im Jahr zurück
        var curr_month = new Date().getMonth();
        // gibt den aktuellen Tag im Monat zurück
        var curr_day = new Date().getDate();

        // gibt die Startzeit in Millisekunden (since Epoch) zurück
        var start_time = new Date(curr_year, curr_month, curr_day, getStart_time()[0], getStart_time()[1], 0, 0);
        // gibt die Endzeit in Millisekunden (since Epoch) zurück
        var end_time = new Date(curr_year, curr_month, curr_day, getEnd_time()[0], getEnd_time()[1], 0, 0);
        // gibt die aktuelle Zeit in Millisekunden (since Epoch) zurück
        var curr_time = new Date();

        //console.log("Start Sekunden: " + start_time.getTime());
        //console.log("Aktuelle Sekunden: " + curr_time.getTime());
        //console.log("Ende Sekunden: " + end_time.getTime());


        // Liest die aktuellen Werte für Stunden, Minuten und Sekunden aus
        var curr_hour = new Date().getHours();
        var curr_min = new Date().getMinutes();
        var curr_sec = new Date().getSeconds();

        // Berechnet die Deltas für Stunden, Minuten und Sekunden (zw. aktueller Uhrzeit und Endzeit)
        var hoursToEnd = getEnd_time()[0] - curr_hour;
        var minutesToEnd = getEnd_time()[1] - curr_min;
        // Wenn negatives Vorzeichen bei dem Delta für Minuten
        if (minutesToEnd < 0) {
            hoursToEnd--;
            minutesToEnd = minutesToEnd + 60;
        }
        // Wenn negatives Vorzeichen bei dem Delta für Sekunden
        var secondsToEnd = 0 - curr_sec;
        if (secondsToEnd < 0) {
            minutesToEnd--;
            secondsToEnd = secondsToEnd + 60;
        }

        // Berechnet verbleibende Zeit in Sekunden (für den Countdown)
        var remainingSeconds = hoursToEnd * 60 * 60 + minutesToEnd * 60 + secondsToEnd;

        console.log(".now() + remaining: " + remainingSeconds);

        /*$("#clock").countdown(remainingMilliseconds, {
            elapse: true
        }).on("update.countdown", function (event) {
            var $this = $(this);
            if (event.elapsed) {
                $this.html(event.strftime('<span>%H:%M:%S</span>'));
            } else {
                $this.html(event.strftime('<span>%H:%M:%S</span>'));
            }
        });*/


        if ($('.ClassyCountdown-wrapper').length > 0) {
            console.log("IF");
            $('#countdown15').remove();
            console.log("Inhalt entfernt.");
            $('#cc-box').html('<div id="countdown15" class="ClassyCountdownDemo container"></div>');
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });
        } else {
            console.log("ELSE");
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });
        }
    }

    // Funktion zur Berechnung der Arbeitszeit, der Differenz zur Regeldienstzeit und des prozentualen Anteils der Arbeitszeit an der Regeldienstzeit
    function calculate() {
        var diff_time = getTimeDifference();
        var work_time = getWork_time();
        var percentage = getPercentage();

        var diff_hours = diff_time[0];
        var diff_mins = diff_time[1];
        var diff_positive = diff_time[2];

        if (diff_mins < 10) {
            diff_time = diff_hours + ":0" + diff_mins;
        } else {
            diff_time = diff_hours + ":" + diff_mins;
        }

        // Wenn Diffenrenz negativ & Diff-Stunden = 0
        if (diff_positive == false && diff_hours == 0) {
            $("#difference").html("-" + diff_time);
            // Wenn Diff-Stunden = 0 & Diff-Minuten = 0
        } else if (diff_hours == 0 && diff_mins == 0) {
            $("#difference").html(diff_time);
            // Wenn Differenz negativ & Diff-Stunden < 0
        } else if (diff_positive == false && diff_hours < 0) {
            $("#difference").html(diff_time);
        } else if (isNaN(diff_hours) && isNaN(diff_mins)) {
            $("#worktime").html("0:00");
            $("#difference").html("0:00");
            $("#percentage").html("0,00%");
        } else if (diff_positive == true) {
            $("#difference").html("+" + diff_time);
        }
        var work_hours = work_time[0];
        var work_mins = work_time[1];
        if (work_mins < 10) {
            work_time = work_hours + ":0" + work_mins;
        } else {
            work_time = work_hours + ":" + work_mins;
        }
        if (isNaN(work_hours) && isNaN(work_mins)) {
            $("#worktime").html("0:00");
            $("#percentage").html("0,00%");
        } else {
            $("#worktime").html(work_time);
            $("#percentage").html(percentage + "%");
        }
    }

    // Berechnet das Dienstende anhand der Start-, Pausen-, und Soll-Dienstzeit
    function set_end() {
        var start_time = getStart_time();
        var pause_time = getPause_time();
        var soll_time = getSoll_time();

        start_hours = parseInt(start_time[0], 10);
        start_mins = parseInt(start_time[1], 10);
        pause_hours = parseInt(pause_time[0], 10);
        pause_mins = parseInt(pause_time[1], 10);
        soll_hours = parseInt(soll_time[0], 10);
        soll_mins = parseInt(soll_time[1], 10);

        end_hours = start_hours + pause_hours + soll_hours;
        end_mins = start_mins + pause_mins + soll_mins;

        if (end_hours >= 24) {
            end_hours = end_hours - 24;
        }

        //console.log("end_mins: " + end_mins);
        // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 120 sind
        if (end_mins >= 120) {
            //console.log("if end_mins >= 120 gestartet");
            end_mins = end_mins - 120;
            //console.log("end_mins: " + end_mins);
            end_hours += 2;
        }

        // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 60 sind
        if (end_mins >= 60) {
            //console.log("if end_mins >= 60 gestartet");
            end_mins = end_mins - 60;
            //console.log("end_mins: " + end_mins);
            end_hours++;
        }


        if (end_mins < 10) {
            end_mins = "0" + end_mins;
        }

        $("#end").val(end_hours + ":" + end_mins);
    }


    $('#countdown16').ClassyCountdown({
        theme: "flat-colors-wide",
        end: $.now() + 10000
    });
    $('#countdown17').ClassyCountdown({
        theme: "flat-colors-very-wide",
        end: $.now() + 10000
    });
    $('#countdown18').ClassyCountdown({
        theme: "flat-colors-black",
        end: $.now() + 10000
    });
    $('#countdown1').ClassyCountdown({
        theme: "white",
        end: $.now() + 645600
    });
    $('#countdown5').ClassyCountdown({
        theme: "white",
        end: $.now() + 10000
    });
    $('#countdown6').ClassyCountdown({
        theme: "white-wide",
        end: $.now() + 10000
    });
    $('#countdown7').ClassyCountdown({
        theme: "white-very-wide",
        end: $.now() + 10000
    });
    $('#countdown8').ClassyCountdown({
        theme: "white-black",
        end: $.now() + 10000
    });
    $('#countdown11').ClassyCountdown({
        theme: "black",
        style: {
            secondsElement: {
                gauge: {
                    fgColor: "#F00"
                }
            }
        },
        end: $.now() + 10000
    });
    $('#countdown12').ClassyCountdown({
        theme: "black-wide",
        labels: false,
        end: $.now() + 10000
    });
    $('#countdown13').ClassyCountdown({
        theme: "black-very-wide",
        labelsOptions: {
            lang: {
                days: 'D',
                hours: 'H',
                minutes: 'M',
                seconds: 'S'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        end: $.now() + 10000
    });
    $('#countdown14').ClassyCountdown({
        theme: "black-black",
        labelsOptions: {
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        end: $.now() + 10000
    });
    $('#countdown4').ClassyCountdown({
        end: $.now() + 10000,
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#1abc9c"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            hours: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#2980b9"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            minutes: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#8e44ad"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            seconds: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#f39c12"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown2').ClassyCountdown({
        end: '1388468325',
        now: '1378441323',
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#1abc9c"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            hours: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#2980b9"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            minutes: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#8e44ad"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            seconds: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#f39c12"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown9').ClassyCountdown({
        end: '1388468325',
        now: '1380501323',
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#1abc9c",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            hours: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#2980b9",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            minutes: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#8e44ad",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            seconds: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#f39c12",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown10').ClassyCountdown({
        end: '1397468325',
        now: '1388471324',
        labels: true,
        labelsOptions: {
            lang: {
                days: 'D',
                hours: 'H',
                minutes: 'M',
                seconds: 'S'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            hours: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            minutes: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            seconds: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown3').ClassyCountdown({
        end: '1390868325',
        now: '1388461323',
        labels: true,
        labelsOptions: {
            lang: {
                days: 'Zile',
                hours: 'Ore',
                minutes: 'Minute',
                seconds: 'Secunde'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            hours: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            minutes: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            seconds: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });

    $("#start_Tour").click(function () {
        $('.introjs-relativePosition').addClass('introjs-showElement');
        introJs().refresh();
        introJs().start();
    })

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 1500) {
            $("#x-mas-Theme").addClass('fixed-element');
        } else {
            $("#x-mas-Theme").removeClass('fixed-element');
        }
    });

    $(window).scroll(function (e) {
        parallax();
    });

    function parallax() {
        var scrolled = $(window).scrollTop();
        $('.parallax').css('bottom', -(scrolled * 0.1) + 'px');
    }

    $.cookie('azr', 'the_value', { expires: 7, path: '/' });

});
