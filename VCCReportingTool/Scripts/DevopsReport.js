
var initialPriorityValue, changedPriorityValue, PriorityType, bdycontent, isContnetExist = false; promptActionToDo = "";
var tablecounids = ["#spn-NonUpdatedData", "#spn-CompletedItems", "#spn-SelectedforDev", "#spn-DevInProgress", "#spn-Backlog"];

$(document).ready(function () {
    $('.priority-edit').on('change', function () {
        initialPriorityValue = $(this).attr('data-val');
        changedPriorityValue = $(this).val();
        if (initialPriorityValue > changedPriorityValue) {
            PriorityType = "Dec";
        }
        else if (initialPriorityValue < changedPriorityValue) {
            PriorityType = "Inc";
        }
    });

    $('#getCheckboxValues').click(function () {
        var str = "";
        var FilterText = $("#txtFilterText1").val();
        $.each($("input[name='chkBox']:checked"), function () {
            str = str + "'One\\Business Applications Group Websites\\" + $(this).val() + "',"
        });
        str = str.slice(0, -1);
        $("#divLoader").show();
        $.ajax({
            url: '../Home/GetProjects/',
            type: 'POST',
            dataType: 'json',
            data: { 'SelectedItems': str, 'FilterText': FilterText },
            success: function (response) {
                $("#divLoader").hide();
                displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
            },
            error: function (jqXhr, textStatus, errorMessage) {
                $("#divLoader").hide();
                displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
            }
        });
    });

    bdycontent = '<div class="checkbox form-group"><label><input type="checkbox" value="Dynamics 365 Marketing Website" name="chkBox">Dynamics</label></div>';

    $(".filterData").click(function () {
        $("#lblfilterProject").removeClass("hide");
        $(".noworkitems").remove();
        var selectedProject = $(this).attr("data-projectcode");
        $("#FilteredProject").val(selectedProject);
        $('table tr>td:nth-child(3)').each(function () {
            if ($(this).find('label').html() == selectedProject) {
                $(this).parent().removeClass("hide");
            }
            else {
                $(this).parent().addClass("hide");
            }
        });
        for (var i = 0; i < tablecounids.length; i++) {
            updateTableCount(tablecounids[i]);
        }
    });

    $("#mdl-btn-yes").click(function () {
        if (promptActionToDo === "ClearFilter") {
            ClearFilter();
        }
    });

    $("#mdl-btn-ok").click(function () {
        if (promptActionToDo === "OK") {
            location.reload();
        }
    });

    $("#btn-clearfilter").click(function () {
        displayModelPopup("Alert", "<b> Do you want to remove all the applied filters?</b>", false, "ClearFilter")
    });
})


function updateTableCount(id) {
    var str = '<tr class="tablecount noworkitems"><td colspan="10" align="center">Currently No Workitems under this Category.</td></tr>';
    if ($(id).parent().next().find('tbody >tr').not('.hide, .tablecount').length == 0) {
        $(id).parent().next().find('tbody tr').addClass("hide");
        $(id).parent().next().find('tbody').append(str);
        $(id).html("(" + $(id).parent().next().find('tbody >tr').not('.hide, .tablecount').length + ")");
    } else { $(id).html("(" + $(id).parent().next().find('tbody >tr').not('.hide, .tablecount').length + ")"); }
}

function displayModelPopup(hdrlbl, bdycontent, isinfo, actionToDo) {
    //-- Clearing all the popup content
    $("#hdr-section-label").html(''); $("#mdl-body-container").html('');
    $("#mdl-btn-ok", "#mdl-btn-yes", "#mdl-btn-no", "#mdl-btn-cancel").addClass("hidden");
    $("#hdr-section-label").html(hdrlbl)
    $("#mdl-body-container").html(bdycontent)
    if (isinfo) {
        $("#mdl-btn-ok").removeClass("hidden");
    }
    else {
        $("#mdl-btn-yes, #mdl-btn-no").removeClass("hidden");
    }
    if (actionToDo != "") { promptActionToDo = actionToDo; }

    $("#btn-dsply-mdl-popup").trigger("click");
}

function AddnewComment(a) {
    var Comment = $(a).parent().parent().find(".modal-body #inputComment").val();
    var EditedBy = $(a).parent().parent().find(".modal-body #inputName").val();
    var EditedDate = $(a).parent().parent().find(".modal-body #inputDate").val();
    var NoteID = $(a).parent().parent().find(".modal-body #inputNoteID").val();

    var validationSumary = false;
    $(".Validation-EditComment").text("");
    if (!EditedBy) { $(".Validation-EditComment").append("Please Select Edited User <br>"); validationSumary = true; }
    if (!Comment) { $(".Validation-EditComment").append("Please Enter Comment <br>"); validationSumary = true; }
    if (validationSumary) { return; }
    $(".Validation-EditComment").text("");
    $("#divLoader").show();
    $.ajax({
        url: '../WorkItems/NewNoteUpdate/',
        type: 'POST',
        dataType: 'json',
        data: { 'UpdatedNote': Comment, 'EditedBy': EditedBy, 'EditedDate': EditedDate, 'NoteId': NoteID },
        success: function (response) {
            $("#divLoader").hide();
            $("#btn-AddComment-Cancel").trigger("click");
            displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $("#divLoader").hide();
            displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
        }
    });
}

function AddNewFixVersion(a) {
    var FixVersionName = $(a).parent().parent().find(".modal-body #inputFixVersionName").val();
    var Comment = $(a).parent().parent().find(".modal-body #inputFixVersionComment").val();
    var WorkItemID = $(a).parent().parent().find(".modal-body #inputFixVersionWorkItemID").val();
    var FixVersionID = $(a).parent().parent().find(".modal-body #inputFixVersionID").val();

    var validationSumary = false;
    $(".Validation-AddFixVersion").text("");
    if (!FixVersionName) { $(".Validation-AddFixVersion").append("Please Enter FixVersion Name <br>"); validationSumary = true; }
    if (!Comment) { $(".Validation-AddFixVersion").append("Please Enter Comment <br>"); validationSumary = true; }
    if (validationSumary) { return; }
    $(".Validation-AddFixVersion").text("");
    $("#divLoader").show();
    $.ajax({
        url: '../WorkItems/AddNewFixVersion/',
        type: 'POST',
        dataType: 'json',
        data: { 'FixVersionName': FixVersionName, 'Comment': Comment, 'WorkItemID': WorkItemID, 'FixVersionID': FixVersionID },
        success: function (response) {
            $("#divLoader").hide();
            $("#btn-AddFixVersion-Cancel").trigger("click");
            displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $("#divLoader").hide();
            displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
        }
    });
}

function AddnewCommentforNewNote(a) {
    var UpdateBy = $(a).parent().parent().find(".modal-body #inputeditedbyforNewNote").val();
    var Comment = $(a).parent().parent().find(".modal-body #inputCommentforNewNote").val();
    var WorkItemID = $(a).parent().parent().find(".modal-body #inputworkitemforNewNote").val();

    var validationSumary = false;
    $(".Validation-AddNewNote").text("");
    if (!UpdateBy) { $(".Validation-AddNewNote").append("Please Select User <br>"); validationSumary = true; }
    if (!Comment) { $(".Validation-AddNewNote").append("Please Enter Comment <br>"); validationSumary = true; }
    if (validationSumary) { return; }
    $(".Validation-AddNewNote").text("");
    $("#divLoader").show();
    $.ajax({
        url: '../WorkItems/AddNoteforWorkItem/',
        type: 'POST',
        dataType: 'json',
        data: { 'Comment': Comment, 'WorkItemID': WorkItemID, 'UpdateBy': UpdateBy },
        success: function (response) {
            $("#divLoader").hide();
            $("#btn-AddComment-NewNote-Cancel").trigger("click");
            displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $("#divLoader").hide();
            displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
        }
    });
}

function ClearFilter() {
    $("table > tbody > tr").each(function () {
        $(this).removeClass("hide");
    });
    for (var i = 0; i < tablecounids.length; i++) {
        updateTableCount(tablecounids[i]);
    }
    $("#lblfilterProject").addClass("hide");
    $(".noworkitems").remove();
}

function deleteComment(a) {
    var NoteId = $(a).parent().parent().find(".modal-body #DeleteNoteID").val();
    $("#divLoader").show();
    $.ajax({
        url: '../WorkItems/DeleteNote/',
        type: 'POST',
        dataType: 'json',
        data: { 'id': NoteId },
        success: function (response) {
            $("#divLoader").hide();
            $("#btn-DeleteComment-Cancel").trigger("click");
            displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $("#divLoader").hide();
            displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
        }
    });
}

function UpdateWorkItem(a) {
    var devopsid = $(a).parent().parent().find(".modal-body #DevopsItem").val();
    var summary = $(a).parent().parent().find(".modal-body #Summary").val();
    var priority = $(a).parent().parent().find(".modal-body #Priority").val();
    var fixversion = $(a).parent().parent().find(".modal-body #FixVersion").val();
    var pendingwith = $(a).parent().parent().find(".modal-body #PendingWith").val();
    var date = $(a).parent().parent().find(".modal-body #date").val();
    var notes = $(a).parent().parent().find(".modal-body #Notes").val();
    var status = $(a).parent().parent().find(".modal-body #Status").val();
    var assignee = $(a).parent().parent().find(".modal-body #Assignee").val();
    var validationSumary = false;
    $("#Validation-UpdateWorkItem").text("");
    if (!priority) { $("#Validation-UpdateWorkItem").append("Please Enter Priority <br>"); validationSumary = true; }
    if (!fixversion) { $("#Validation-UpdateWorkItem").append("Please Enter fixversion <br>"); validationSumary = true; }
    if (!pendingwith) { $("#Validation-UpdateWorkItem").append("Please Select pending with <br>"); validationSumary = true; }
    if (!date) { $("#Validation-UpdateWorkItem").append("Please Enter ReleaseDate <br>"); validationSumary = true; }
    if (!notes) { $("#Validation-UpdateWorkItem").append("Please Enter Note Comment <br>"); validationSumary = true; }
    if (!status) { $("#Validation-UpdateWorkItem").append("Please Select Status <br>"); validationSumary = true; }
    if (!assignee) { $("#Validation-UpdateWorkItem").append("Please Select Assignee <br>"); validationSumary = true; }
    if (validationSumary) { return; }
    $("#Validation-UpdateWorkItem").text("");
    $("#divLoader").show();
    $.ajax({
        url: '../WorkItems/UpdateWorkitembyID/',
        type: 'POST',
        dataType: 'json',
        data: {
            'devopsid': devopsid,
            'summary': summary,
            'priority': priority,
            'fixversion': fixversion,
            'pendingwith': pendingwith,
            'date': date,
            'notes': notes,
            'status': status,
            'assignee': assignee
        },
        success: function (response) {
            $("#divLoader").hide();
            $("#btn-UpdateWorkItem-Cancel").trigger("click");
            displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
        },
        error: function (data) {
            $("#divLoader").hide();
            displayModelPopup("Error", "<b> " + data.responseText + "</b>", true, "OK")
        }
    });
}

$(function () {
    $('.edit-mode').hide();
    $('.edit-user, .cancel-user').on('click', function () {
        var tr = $(this).parents('tr:first');
        tr.find('.edit-mode, .display-mode').toggle();
    });

    $('.save-user').on('click', function () {
        var txt;
        var tr = $(this).parents('tr:first');
        var WIStatus = tr.find("#Status" + $(this).attr("id")).val();
        if (WIStatus == 1) {
            var result = confirm("Status Changed to 'Done' for selected workItem! Are you sure you want to change the Priorities Accordingly ?");
            if (result == true) {
                txt = "OK";
            } else {
                txt = "Cancel";
            }
        }

        if (initialPriorityValue == undefined) { initialPriorityValue = 0 }
        if (changedPriorityValue == undefined) { changedPriorityValue = 0 }

        var Summary = tr.find("#Summary").val();
        var Priority = 0;
        if (tr.find("#Priority").val() != "") {
            Priority = tr.find("#Priority").val();
        }
        var pendingWith = tr.find("#PendingWith").val();
        var ReleaseDate = tr.find("#ExpectedReleaseDate").val();
        var Status = tr.find("#Status" + $(this).attr("id")).val();
        var Assignee = tr.find("#Assignee" + $(this).attr("id")).val()
        var DevopsID = tr.find("#DevopsItemID a").html();

        tr.find('.edit-mode, .display-mode').toggle();
        var UserModel =
            {
                "DevopsItemID": DevopsID,
                "Summary": Summary,
                "Priority": Priority,
                "pendingWith": pendingWith,
                "ExpectedReleaseDate": ReleaseDate,
                "Status": Status,
                "Assignee": Assignee
            }
        $("#divLoader").show();
        $.ajax({
            url: '../WorkItems/UpdateRecord/',
            data: { 'initialPriorityValue': initialPriorityValue, 'changedPriorityValue': changedPriorityValue, 'PriorityType': PriorityType, 'PromptClick': txt, 'workitem': JSON.stringify(UserModel) },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                //alert(response.responseText)
                //location.reload();
                $("#divLoader").hide();
                displayModelPopup("Alert", "<b> " + response.responseText + "</b>", true, "OK")
            },
            error: function (jqXhr, textStatus, errorMessage) {
                $("#divLoader").hide();
                displayModelPopup("Error", "<b> " + errorMessage + "</b>", true, "OK")
            }
        });
    });
})
