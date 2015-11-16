var activity = false;

function render_table(limit, offset)
{
    activity = true;
    show_activity();
    var table = window.location.href.slice(window.location.href.indexOf("?") + 1);
    $.get("/" + table, function(tableInfo) {
        $("#table_caption").html($("#table_caption_tmpl").tmpl(tableInfo.table_name));
        tableInfo["attributes"].unshift(" ");
        $("#table_header").html($("#table_header_tmpl").tmpl(tableInfo.attributes));
        tableInfo["attributes"].shift(" ");
        $.get("/" + table + "/_all_records?limit=" + limit + "&skip=" + offset, function(data) {
            data.number_of_attributes = tableInfo.number_of_attributes;
            $("#table_footer").html($("#table_footer_tmpl").tmpl(data));
            data = data.rows;
            for (key in data) {
                data[key].keys = tableInfo.attributes;
                data[key].table = table;
                data[key].table = table;
            }
            $("#table_body").html($("#table_body_tmpl").tmpl(data));
            activity = false;
            hide_activity();
        });
    });
}

function render_record()
{
    activity = true;
    show_activity();
    var table_record = window.location.href.slice(window.location.href.indexOf("?") + 1).split(/\//);
    var table = table_record[0];
    var record = table_record[1];
    $.get("/" + table, function(tableInfo) {
        $("#table_caption").html($("#table_caption_tmpl").tmpl({"table": tableInfo.table_name, "record": record}));
        $.get("/" + table + "/" + record, function(data) {
            $("#table_body").html($("#table_body_tmpl").tmpl(data.rows[0]));
            activity = false;
            hide_activity();
        });
    });
}

function create_test_table () {
    $.ajax({url: "/test", type: "PUT", async: false, data: JSON.stringify(["id", "timestamp", "test_field"]), success: function (data) {
        if (data == "ok") {
            for (var i = 1; i <= 500 ; i++) {
                $.ajax({url: "/test", type: "POST", async: false, data: JSON.stringify({"id": i, "test_field_1": new Date().getTime(), "test_field": "the brown fox jumps over the lazy dog"})});
            }
            location.reload();
        }
    }});
}

function delete_test_table () {
    $.ajax({url: "/test", type: "DELETE", async: false, success: function (data) {
        location.reload();
    }});   
}

function delete_test_table (name) {
    $.ajax({url: "/" + name, type: "DELETE", async: false, success: function (data) {
        location.reload();
    }});   
}

function delete_test_record2 (tname,rid) {
    $.ajax({url: "/" + tname + "/" +rid, type: "DELETE", async: false, success: function (data) {
        location.reload();
    }});   
}

function show_activity () {
    $("#activity_indicator").fadeIn(125, function () {
        if (activity) {
            hide_activity();
        }
    });
}

function hide_activity () {
    $("#activity_indicator").fadeOut(125, function () {
        if (activity) {
            show_activity();
        }
    });
}

function create_table () {
   $.ajax({url: "/" + $("#table_name").val(), type: "PUT", async: false, data: JSON.stringify(["id", "timestamp", "test_field"]), success: function (data) {
     location.reload();
 }});
}

function delete_table () {
    var checkValues = $('input[name=my_check_box]:checked').map(function() {
        delete_test_table($(this).val());
        return $(this).val();
    }).get();
}

function create_record() {
          var _len = $("#table tr").length;        
            //$("#table").append("<tr id="+_len+" align='center'>"
                $("#table").append("<tr id='new_record' align='center'>"
                       +"<td>"+_len+"</td>"
                       +"<td><input type='text' id='col1'/></td>"
                       +"<td><input type='text' id='col2'/></td>"
                       +"<td><input type='text' id='col3'/></td>"
                   +"</tr>");       
}

function delete_record() {
    var checkValues = $('input[name=my_check_box]:checked').map(function() {
        delete_test_record2($("#tname").text(),$(this).parent().next("td").attr("id"));
        return $(this).val();
    }).get();
}

function update_record() {
     $.ajax({
        url: "/" + $("#tname").text(), type: "POST", async: false, data: JSON.stringify({
        "id": $("#col1").attr("value"), "test_field_1": $("#col2").attr("value"), 
        "test_field": $("#col3").attr("value")
        })
    });
     location.reload();

}