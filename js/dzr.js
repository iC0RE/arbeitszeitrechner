$("#30").click(function(){
    $("#soll").val("06:00");
    $("#30").addClass("active");
    $("#35, #39, #40, #41").removeClass("active");
    })
    $("#35").click(function(){
        $("#soll").val("07:00");
        $("#35").addClass("active");
        $("#30, #39, #40, #41").removeClass("active");
    })
    $("#39").click(function(){
        $("#soll").val("07:48");
        $("#39").addClass("active");
        $("#30, #35, #40, #41").removeClass("active");
    })
    $("#40").click(function(){
        $("#soll").val("08:00");
        $("#40").addClass("active");
        $("#30, #35, #39, #41").removeClass("active");
    })
    $("#41").click(function(){
        $("#soll").val("08:12");
        $("#41").addClass("active");
        $("#30, #35, #39, #40").removeClass("active");
    })

    $("#default").click(function(){
    $("#default").addClass("active");
    $("#winter").removeClass("active");
    })

    $("#winter").click(function(){
    $("#winter").addClass("active");
    $("#default").removeClass("active");
    })

function getStart_time(){
    var start_time = $("#start").val().split(":");

    var start_hours = parseInt(start_time[0],10);
    var start_mins = parseInt(start_time[1],10);

    start_time = [start_hours,start_mins];
    return start_time;
}

function getEnd_time(){
    var end_time = $("#end").val().split(":");

    var end_hours = parseInt(end_time[0],10);
    var end_mins = parseInt(end_time[1],10);

    end_time = [end_hours, end_mins];
    return end_time;
}

// Differenz zwischen Start und Ende
function getDiff_time(){
    var start_time = getStart_time();
    var end_time = getEnd_time();

    var start_hours = parseInt(start_time[0],10);
    var start_mins = parseInt(start_time[1],10);
    var end_hours = parseInt(end_time[0],10);
    var end_mins = parseInt(end_time[1],10);

    var diff_hours = end_hours - start_hours;
    var diff_mins = end_mins - start_mins;

    // Bei negativer Differenz: +60min & -1h
    if(diff_mins < 0){
        diff_hours --;
        diff_mins = diff_mins + 60;
    }
    var diff_time = [diff_hours, diff_mins];
    return diff_time;
}

// Standard-Wert für die Pausenzeit ein
function setDefault (){
    var diff_time = getDiff_time();
    var diff_hours = diff_time[0];
    var diff_mins = diff_time[1];

    // Wenn Differenz zwischen 6:00 und 6:30 liegt...
    if(diff_hours == 6 && diff_mins >= 0 && diff_mins <= 30){
        if(diff_mins < 10){
            $("#pause").val("00:0" + diff_mins.toString());
        }else{
            $("#pause").val("00:" + diff_mins.toString());
        }
    // Wenn Differenz größer als 6:30
    }else if(diff_hours >= 6 && diff_mins > 30 || diff_hours >= 7){
        // Wenn Differenz kleiner 9:31 (9h Arbeitszeit & 30min Pause)
        if(diff_hours == 9 && diff_mins <= 30){
            $("#pause").val("00:30");
        // Wenn Differenz zwischen 9:30 und 9:45
        }else if(diff_hours == 9 && diff_mins > 30 && diff_mins <= 45){
            $("#pause").val("00:" + diff_mins.toString());
        // Wenn Differenz größer 9:45
        }else if(diff_hours == 9 && diff_mins > 45 || diff_hours > 9){
            $("#pause").val("00:45");
        // Sonst
        }else{
            $("#pause").val("00:30");
        }
    // Sonst
    }else{
        $("#pause").val("00:00");
    }
}

function getPause_time(){
    var pause_time = $("#pause").val().split(":");

    var pause_hours = parseInt(pause_time[0],10);
    var pause_mins = parseInt(pause_time[1],10);

    pause_time = [pause_hours, pause_mins];
    return pause_time;
}

function getSoll_time(){
    var soll_time = $("#soll").val().split(":");

    var soll_hours = parseInt(soll_time[0],10);
    var soll_mins = parseInt(soll_time[1],10);

    soll_time = [soll_hours, soll_mins];
    return soll_time;
}

// Berechnet die reine Arbeitszeit (abzüglich Pause)
function getWork_time(){
    var pause_time = getPause_time();
    var diff_time = getDiff_time();

    var diff_hours = diff_time[0];
    var diff_mins = diff_time[1];
    var pause_hours = pause_time[0];
    var pause_mins = pause_time[1];

    var work_hours = diff_hours - pause_hours;
    var work_mins = diff_mins - pause_mins;

    if(work_mins < 0){
        work_hours --;
        work_mins = work_mins + 60;
    }

    var work_time = [work_hours, work_mins];
    return work_time;
}

// Berechnet die Differenz zwischen IST und SOLL
function getDifference(){
    var soll_time = getSoll_time();
    var work_time = getWork_time();

    var work_hours = work_time[0];
    var work_mins = work_time[1];
    var soll_hours = soll_time[0];
    var soll_mins = soll_time[1];

    var diff_hours = work_hours - soll_hours;
    // Wenn Diff-Stunden = 0 & Arbeitsminuten > Sollminuten
    if(diff_hours == 0 && work_mins > soll_mins){
        var diff_mins = work_mins - soll_mins;
    // Wenn Diff-Stunden > 0
    }else if(diff_hours > 0){
        var diff_mins = 60 - soll_mins + work_mins;
        diff_hours --;
        // Wenn Diff-Minuten >= 60
        if(diff_mins >= 60){
            diff_mins = diff_mins - 60;
            diff_hours ++;
        }
    // Sonst
    }else{
        // Wenn Arbeitsminuten zwischen Sollminuten und 60 ziehe von 60 Minuten die Arbeitsminuten ab und addiere die Sollminuten
        if(work_mins > soll_mins && work_mins < 60){
            var diff_mins = 60 - work_mins + soll_mins;
            diff_hours ++;
        }else{
            var diff_mins = soll_mins - work_mins;
        }
    }


    if(diff_mins < 0){
        diff_hours --;
        diff_mins = diff_mins + 60;
    }

    if(work_hours == soll_hours && work_mins < soll_mins || work_hours < soll_hours){
        var positive = false;
    }else{
        var positive = true;
    }

    var diff_time = [diff_hours, diff_mins, positive];
    return diff_time;
}

// Berechnet die Differenz zwischen Arbeitszeit und Sollzeit in Prozent
function getPercentage(){
    var work_time = getWork_time();
    var soll_time = getSoll_time();

    var work_hours = work_time[0];
    var work_mins = work_time[1];
    var soll_hours = soll_time[0];
    var soll_mins = soll_time[1];

    work_mins = work_hours*60 + work_mins;
    soll_mins = soll_hours*60 + soll_mins;

    var percentage = Math.round(work_mins*100/soll_mins);

    return percentage;
}

function getRegularWorking_time(){
    var start_time = getStart_time();
    var soll_time = getSoll_time();

    start_hours = parseInt(start_time[0],10);
    start_mins = parseInt(start_time[1],10);
    soll_hours = parseInt(soll_time[0],10);
    soll_mins = parseInt(soll_time[1],10);

    if(soll_hours == 6 && soll_mins > 30){
        var pause_mins = 30;
    }else if(soll_hours > 6){
        if(soll_hours == 9 && soll_mins > 45){
            var pause_mins = 45;
        }else if(soll_hours > 9){
            var pause_mins = 45;
        }else{
            var pause_mins = 30;
        }
    }else{
        var pause_mins = 0;
    }

    var regular_hours = start_hours + soll_hours;
    var regular_mins = start_mins + soll_mins + pause_mins;

    if(regular_mins >= 60){
        regular_mins = regular_mins - 60;
        regular_hours ++;
    }
    var regular_time = [regular_hours, regular_mins];
    return regular_time;
}

$("#calculate").click(function(){
    var diff_time = getDifference();
    console.log(diff_time);
    var work_time = getWork_time();
    var percentage = getPercentage();

    var diff_hours = diff_time[0];
    var diff_mins = diff_time[1];
    var diff_positive = diff_time[2];

    if(diff_mins < 10){
        diff_time = diff_hours + ":0" + diff_mins;
    }else{
        diff_time = diff_hours + ":" + diff_mins;
    }

    if(diff_positive == false && diff_hours == 0){
        $("#difference").html("-" + diff_time);
    }else if(diff_hours == 0 && diff_mins == 0){
        $("#difference").html(diff_time);
    }else if (diff_positive == false && diff_hours < 0){
        $("#difference").html(diff_time);
    }else{
        $("#difference").html("+" + diff_time);
    }

    var work_hours = work_time[0];
    var work_mins = work_time[1];
    if(work_mins < 10){
        work_time = work_hours + ":0" + work_mins;
    }else{
        work_time = work_hours + ":" + work_mins;
    }
    $("#worktime").html(work_time);
    $("#percentage").html(percentage + "%");
});

$("#choose_time").click(function(){
    setSoll_time;
})

$("#start").focusout(function(){
    setDefault();
    var regular_time = getRegularWorking_time();
    var regular_hours = regular_time[0];
    var regular_mins = regular_time[1];
    $("#end").val(regular_hours + ":" + regular_mins);
})

$("#end").focusout(function(){
    setDefault();
})

$("#panel-btn").click(function(){
    $("#panel-content").css("display", "block");
});

$(".collapse").each(function(){
    if ($(this).hasClass('in')) {
        $(this).collapse('toggle');
    }
});
