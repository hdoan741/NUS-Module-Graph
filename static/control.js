
var tab_counter = 2;

function createStageAndDraw(containerId, moduleCode) {
    console.log(moduleCode);
    stage = new Kinetic.Stage(containerId, 1085, 2000);
    tabLayer = new Array();
    tabLayer[0] = new Kinetic.Layer("tabLayer[0]");
    drawModule(moduleCode);
    stage.add(tabLayer[0]);
}

function addModuleTab(moduleCode) {
    var tab_title = moduleCode;
    $('#graph-tabs').tabs( "add", "#tab-" + tab_counter, tab_title );
    tab_counter++;
}

function moduleSelected(moduleCode) {
    $.getJSON('/module/' + moduleCode, function(moduleInfo) {
        $('#module_other_desc').show();
        $('#module_code').html(moduleInfo['code']);
        $('#module_mc').html(moduleInfo['mc'] + 'MCs');
        $('#module_name').html(moduleInfo['name']);
        $('#module_desc').html(moduleInfo['desc']);
        $('#module_wl').html(moduleInfo['workload']);
        $('#module_prereq').html(moduleInfo['prerequisites']);
        $('#module_preexc').html(moduleInfo['preclusions']);
        $('#module_cl').html(moduleInfo['crosslisting']);

        // Add tab
        addModuleTab(moduleCode);
    });
}

function itemSelected(event, ui) {
    moduleSelected(ui.item.value);
}

$(document).ready(function() {
    $('#searchbar').autocomplete({
        source: '/search',
        select: itemSelected
    });
    console.log('Height: ', $(window).height() - 70);
    $('#graph').css('height', $(document).height() - 95);
    $('#module_other_desc').hide();
    $('#graph-tabs').tabs({
        tabTemplate: "<li class='graph-tab-title'><a class='ui-tab-name' href='#{href}'>#{label}</a>"  +
                        "<a><img class='ui-icon-close' src='static/images/close-tab.png' /></a></li>",
        add: function(event, ui) {
            console.log(event, ui);
            var moduleCode = ui.tab.innerHTML;
            var newContainer = 'container-' + tab_counter;
            $(ui.tab.hash).append("<div id='" + newContainer  + "'></div>");
            $(ui.tab.hash).addClass('graph');
            createStageAndDraw(newContainer, moduleCode);
            $('.graph').hide();
            $(ui.tab.hash).show();
            $('#graph-tabs').tabs('select', tab_counter - 1);
        },
        show: function(event, ui) {
            $('.graph').hide();
            $('#tabs-head li').removeClass('ui-tab-selected');
            $('#tabs-head li').addClass('ui-tab-unselected');
            $(ui.tab).removeClass('ui-tab-unselected');
            $(ui.tab).parent().addClass('ui-tab-selected');
            $(ui.tab.hash).show();
        }
    });

    $( "#graph-tabs img.ui-icon-close" ).live( "click", function() {
        var $tabs = $('#graph-tabs');
        var index = $( "li", $tabs ).index( $( this ).parent() );
        $tabs.tabs( "remove", index );
        $tabs.tabs( "select", 0 );
    });

    var imageTickObj = new Image();
    imageTickObj.onload = function(){
    	imageTick = imageTickObj;
    };
    imageTickObj.src = "/static/images/checkbox-checked.png";
    console.log(imageTick);
    
    var imageUnTickObj = new Image();
    imageUnTickObj.onload = function(){
    	imageNotTick = imageUnTickObj;
    };
    imageUnTickObj.src = "/static/images/checkbox-unchecked.png";
 

    stage = new Kinetic.Stage('container-1', 1085, 2000);
    tabLayer = new Array();
    tabLayer[0] = new Kinetic.Layer("tabLayer[0]");
    $.getJSON('/modules', function(modules) {
        readGraph(modules);
        drawGraph();
    });
    stage.add(tabLayer[0]);
});
