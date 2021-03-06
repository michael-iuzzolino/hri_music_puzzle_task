

var MAIN_HEIGHT = 800;
var MAIN_WIDTH = 1200;



function showInstructions() {
    instructions_display = !instructions_display;

    var instructions = d3.select("#instructions");
    var button_group = d3.select("#show_instructions_button_g");

    var show_instructions = instructions_display;

    if (show_instructions) {
        instructions.transition().duration(1000)
            .style("opacity", 1.0)
            .style("display", "inline");

        d3.select("#main_g").transition().duration(1000)
            .style("opacity", 0.2);

        button_group.select("rect").transition().duration(600)
            .style("fill", INSTRUCTIONS_BUTTON_CLICK_COLOR)
            .style("stroke", INSTRUCTIONS_BUTTON_CLICK_BORDER_COLOR);

        button_group.select("text").transition().duration(600)
            .text("Hide Instructions");

        button_group.transition().duration(600)
            .attr("transform", "translate("+(MAIN_WIDTH/2 - 100)+", "+10+")");
    }
    else {
        instructions.transition().duration(1000)
            .style("opacity", 0.0)
            .style("display", "none");

        d3.select("#main_g").transition().duration(1000)
            .style("opacity", 1.0);

        button_group.select("rect").transition().duration(600)
            .style("fill", "white")
            .style("stroke", "black");

        button_group.select("text").transition().duration(600)
            .text("Show Instructions");

        button_group.transition().duration(600)
            .attr("transform", "translate("+10+", "+10+")")
    }
}


function initializeInstructions() {

    var instructions_div = d3.select("#main_div").append("div").attr("id", "instructions_div");

    var instructions = instructions_div.append("img")
        .attr("id", "instructions")
        .attr("src", "/static/data/instructions.png");


    instructions.transition().duration(1000)
        .style("opacity", 1.0);

    instructions_display = true;
    initShowInstructionsButton();

}




function initShowInstructionsButton() {

    d3.select("#show_instructions_button_g").remove();

    // Select main svg
    var main_svg = d3.select("#main_svg");

    // Add show instructions Button
    var show_instructions_button_g = main_svg.append("g")
        .attr("id", "show_instructions_button_g")
        .attr("transform", "translate("+(MAIN_WIDTH/2 - 100)+", "+10+")")
        .style("cursor", "pointer")
        .style("opacity", 0.0)
        .on("mouseover", function() {
            if (instructions_display) {
                return;
            }
            d3.select(this).select("rect").transition().duration(600)
                .style("fill", SHOW_INSTRUCTIONS_BUTTON_HOVER_COLOR);
        })
        .on("mouseout", function() {
            if (instructions_display) {
                return;
            }
            d3.select(this).select("rect").transition().duration(600)
                .style("fill", "white");
        })
        .on("click", function() {
            if (!GAME_STARTED) {
                GAME_STARTED = true;
                startActivityTimer();
                d3.select("#next_melody_button_text").attr("x", 24);

            }
            showInstructions();
        });

    // Button
    show_instructions_button_g.append("rect")
        .attr("id", "show_instructions_button_rect")
        .attr("height", 30)
        .attr("width", 160)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "black");


    // Button text
    show_instructions_button_g.append("text")
        .attr("id", "next_melody_button_text")
        .attr("x", 40)
        .attr("y", 20)
        .style("fill", "black")
        .text("Start Activity");

    // Transition button
    show_instructions_button_g.transition().duration(500)
        .style("opacity", 1.0);

}




function initializeMain() {

    // Main svg
    var main_svg = d3.select("#main_div").append("svg")
        .attr("id", "main_svg")
        .attr("height", MAIN_HEIGHT)
        .attr("width", MAIN_WIDTH);

    // Main svg background
    main_svg.append("rect")
        .attr("height", MAIN_HEIGHT)
        .attr("width", MAIN_WIDTH)
        .style("fill", "white")
        .style("stroke", "black");

    // Main svg g
    main_svg.append("g").attr("id", "main_g");

}


function loadMelodies() {
    $.ajax({
        url: "load_melodies",
        success: (function(melody_result) {
            MELODIES = melody_result;
            TOTAL_MELODIES = melody_result.length;
            for (var i=0; i < TOTAL_MELODIES; i++) {
                var melody_audio_path = melody_result[i].audio_path;
                var melody_audio = new Audio(melody_audio_path);
                MELODIES[i]["audio"] = melody_audio;
            }

            // Initialize current melody
            nextMelody(init=true);
            initializeUserAnswers();
            initializeTask();
        })
    });
}


function initializeContainers() {
    var main_div = d3.select("body").append("div").attr("id", "main_div");

    main_div.append("h1").html("Music Puzzle Activity");

    // Task Window Div
    main_div.append("div").attr("id", "task_div");

    // Piano Div
    main_div.append("div").attr("id", "piano_div");
}


$(document).ready(function() {

    loadMelodies();
    initializeContainers();
    initializeMain();
    initializeInstructions();
    initializePianoBoard();
});




