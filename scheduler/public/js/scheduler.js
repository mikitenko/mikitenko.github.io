$(document).ready(function() {

        $('.dayView').click(function(){
            var f = $('.fc-view.fc-agendaWeek-view.fc-agenda-view .fc-row.fc-widget-header tr').html();
                $('#calendar').fullCalendar('changeView', 'agendaDay');
                $('#calendar').fullCalendar('gotoDate',new Date());
                $('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header table thead tr').html(f);
            // $('.fc-agendaDay-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right').click();
            switchView();
        });

        $('.weekView').click(function(){
            $('.fc-agendaWeek-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right').click();
            switchView();
        });


        var newJson = [{
            id: 1,
            title: 'Physics',
            start: '2017-04-06 00:00',
            end: '2017-04-06 02:00',
            color: 'rgb(251,115,115)'
        },
        {
            id: 2,
            title: 'Writing',
            start: '2017-04-06 02:00',
            end: '2017-04-06 04:00',
            color: 'rgb(127,180,222)'
        },
        {   
            id: 3,
            title: 'Literature',
             start: '2017-04-06 04:00',
            end: '2017-04-06 06:00',
            color: 'rgb(250,198,114)'
        },
        {   
            id: 4,
            title: 'Geographia',
            start: '2017-04-06 06:00',
            end: '2017-04-06 08:00',
            color: 'green'
        },
        {
            id: 5,
            title: 'Geometry',
            start: '2017-04-06 08:00',
            end: '2017-04-06 09:00',
            color: 'pink'
        }];
        
        var cr;
        var calendar = $('#calendar').fullCalendar({
            header: {
                left: '',
                right: 'agendaWeek, agendaDay'
            },
            navLinks: true,
            aspectRatio: 1.0,
            scrollTime: '12:00 AM',
            editable: true,
            defaultView: 'agendaWeek',
            eventLimit: true,
            allDay: false,
            columnFormat: 'ddd',
            axisFormat: 'HH:mm',
            selectable: true,
            viewRender: function (view) {


                setTimeout(function(){
                    if (view.name === 'agendaDay') {
                        $('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header tr th').each(function(){
                            if($(this).html() != "&nbsp;"){
                                var gv = 'fc-'+moment(view.title, 'MMMM DD, YYYY').format('ddd').toLowerCase();
                                $(this).find('a').removeAttr('data-goto');
                                $(this).find('a').attr('style', 'color:#ddd');
                                if($(this).hasClass(gv)) {
                                    $(this).find('a').attr('style', 'color:#000');
                                }
                                // $(this).unbind('click');
                                $(this).click(function(){
                                    console.log($(this).data('date'));
                                    $('#calendar').fullCalendar('gotoDate', new Date($(this).data('date'))); 
                                    $('#calendar').fullCalendar('changeView', 'agendaWeek');
                                });
                            }
                        });
                    }
                },100);

            },
            navLinkDayClick: function(date, jsEvent) {
                var f = $('.fc-view.fc-agendaWeek-view.fc-agenda-view .fc-row.fc-widget-header tr').html();
                $('#calendar').fullCalendar('changeView', 'agendaDay');
                $('#calendar').fullCalendar('gotoDate',date);
                $('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header table thead tr').html(f);
            },
            eventRender: function(event, element) {
                $("#addEventModal").data('event', event);
                element.bind('dblclick', function() {
                	$("#addEventModal").modal('show');

                    $('#fromTime').timepicker('setTime', moment(event.start).format('HH:mm A'));

                    var ntime = moment(event.end,'HH:mm A').format('HH:mm');
                    if(ntime == "23:59"){
                        $('#toTime').timepicker('setTime', '00:00 AM');
                    }else{
                        $('#toTime').timepicker('setTime', moment(event.end).format('HH:mm A'));
                    }
                	$("#exampleInputEmail1").text(event.title).css("background", event.color);
                    $("#addEventModal").data('event', event);

                    if(event.title){
                        $('.'+event.title).click();
                    }

                    $("input:radio").each(function () {
                        var $this = $(this);
                        var taskName = $this.data('task');
                        var colorName = $this.data('color');
                        if(taskName){
                            $('body').on('click', '.' + taskName ,function(){
                                $("#exampleInputEmail1").text(taskName).css("background", colorName);
                                cr = colorName;
                            })
                        }
                    });

                });
            },
            select: function(start, end, allDay) {
                $("#addEventModal").modal('show');
                
                $("input:radio").each(function () {
                    var $this = $(this);
                    var taskName = $this.data('task');
                    var colorName = $this.data('color');
                    if(taskName){
                        $('body').on('click', '.' + taskName ,function(){
                            $("#exampleInputEmail1").text(taskName).css("background", colorName);
                            cr = colorName;
                        })
                    }
                });

                var title = $("#exampleInputEmail1").text();
                $('#fromTime').timepicker('setTime', moment(start).format('HH:mm A'));
                $('#toTime').timepicker('setTime', moment(end).format('HH:mm A'));

                var addData;
                // if (title) {
                    addData = {
                        id: newJson.length + 1,
                        title: title,
                        start: start,
                        end: end
                    };

                    newJson.push(addData);
                    $('#calendar').fullCalendar('renderEvent', addData, true);
                    $('#calendar').fullCalendar('unselect');
                // }
                //     // --
                //     // POST request send in webservice
                    console.log("Add Json Object ", newJson);
            },
            eventDrop: function(event, delta, minuteDelta, allDay, revertFunc){

                for(var key in newJson){
                    if(newJson[key].id == event.id){
                        newJson.splice(key, 1);
                    }
                }

                var setEvent = {};
                setEvent.id = event.id;
                setEvent.title = event.title;
                setEvent.start = moment(event.start.format()).format('YYYY-MM-DD HH:mm');
                setEvent.end = moment(event.end.format()).format('YYYY-MM-DD HH:mm');
                setEvent.color = event.color;

                newJson.push(setEvent);
                $('#calendar').fullCalendar('rendarEvent', setEvent);

                // --
                // Drag and Drop request send in webservice
                console.log("Drag and Drop ", newJson);

            },
            events: newJson
        });
        

		/**************************
        Edit Task
		*/
        $(".editEventBtn").click(function(e) {
            e.preventDefault();

            var title = $("#exampleInputEmail1").text();
            if (!title) {
                alert('Select task for list below');
                return;
            }

            var setEvent = $("#addEventModal").data('event');

            var start;
            var end;
            if($('.from-time').val()){
                var date = moment(setEvent.start).format('YYYY-MM-DD');
                var time = moment($('.from-time').val(),'HH:mm A').format('HH:mm');
                var d = date + ' ' + time;
                start = moment(d).format('YYYY-MM-DD HH:mm');
            }else{
                start = setEvent.start;
            }

            if($('.to-time').val()){
                var edate = moment(setEvent.end).format('YYYY-MM-DD');
                var etime = moment($('.to-time').val(),'HH:mm A').format('HH:mm');
                if(etime == "00:00"){
                    etime = "23:59";
                }
                var dd = edate + ' ' + etime;

                end = moment(dd).format('YYYY-MM-DD kk:mm');
            }else{
                end = setEvent.end;
            }

            var ff = moment($('.to-time').val(),'HH:mm A').format('HH:mm');
            if(ff == '00:00'){
                ff = '23:59';
            }

            if(moment($('.from-time').val(),'HH:mm A').format('HH:mm') > ff){
                alert('start or end time wrong for today');
                return;
            }

            setEvent.title = title;
            setEvent.start = start;
            setEvent.end = end;
            setEvent.color = cr;

            $('#calendar').fullCalendar('updateEvent', setEvent);

            for(var key in newJson){
                if(newJson[key].id == setEvent.id){
                    newJson[key].id = setEvent.id;
                    newJson[key].title = title;
                    newJson[key].start = newJson[key].start;
                    newJson[key].end = newJson[key].end;
                }
            }

            // --
            // PUT request send in webservice
            console.log("Update Json Object ", newJson);

            $("#addEventModal").modal('hide');
            $("#exampleInputEmail1").text('');
            $("#exampleInputEmail1").attr('style', "background:none");
            $('.from-time').val('');
            cr = '';
            $('.to-time').val('');
            start = '';
            end = '';
        });
        

		/**************************
        Delete Task
		*/

        $('.deleteEventBtn').click(function(e){
            e.preventDefault();

            var deleteEvent = $("#addEventModal").data('event');
            if($("#exampleInputEmail1").text() == deleteEvent.title){
                for(var key in newJson){
                    if(newJson[key].id == deleteEvent.id){
                        newJson.splice(key, 1);
                    }
                }
                $('#calendar').fullCalendar('removeEvents', deleteEvent.id);
            }

            $("#addEventModal").modal('hide');
            $("#exampleInputEmail1").text('');
            $("#exampleInputEmail1").attr('style', "background:none");
        });

        $('.cancelBtn').click(function(){
            $("#exampleInputEmail1").attr('style', "background:none");
            $("#exampleInputEmail1").text('');

            var cancelEvent = $("#addEventModal").data('event');
            if(!cancelEvent.title){
                for(var key in newJson){
                    if(newJson[key].id == cancelEvent.id){
                        newJson.splice(key, 1);
                    }
                }
                $('#calendar').fullCalendar('removeEvents', cancelEvent.id);
            }
        }); 


        var switchView = function(){
            var arrayUIDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            for (var m = 0; m < arrayUIDays.length; m++) {
                var dim = ".fc-day-header.fc-widget-header.fc-" + arrayUIDays[m];
                $(dim).click(function(){
                    $('.dayView').prop('checked', true);
                });
            }
        }

        switchView();


    });