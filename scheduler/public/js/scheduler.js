$(document).ready(function () {


	var scheduleJson = [{
		id: 1,
		title: 'Physics',
		start: 'Mon 00:00', //start: '2017-04-06 00:00',
		end: 'Mon 02:00' //end: '2017-04-06 02:00'
	}, {
		id: 2,
		title: 'Writing',
		start: 'Tue 02:00', //start: '2017-04-06 02:00',
		end: 'Tue 04:00' //end: '2017-04-06 04:00'
	}, {
		id: 3,
		title: 'Literature',
		start: 'Wed 04:00', //start: '2017-04-06 04:00',
		end: 'Wed 06:00' //end: '2017-04-06 06:00'
	}, {
		id: 4,
		title: 'Geographia',
		start: 'Thu 06:00', //start: '2017-04-06 06:00',
		end: 'Thu 08:00' //end: '2017-04-06 08:00'
	}, {
		id: 5,
		title: 'Geometry',
		start: 'Fri 08:00', //start: '2017-04-05 08:00',
		end: 'Fri 10:00' //end: '2017-04-05 10:00'
	}, {
		id: 6,
		title: 'Psychology',
		start: 'Sat 03:00', //start: '2017-04-05 03:00',
		end: 'Sat 05:00' //end: '2017-04-05 05:00'
	}, {
		id: 7,
		title: 'Biology',
		start: 'Sun 12:00', //start: '2017-04-05 12:00',
		end: 'Sun 14:00' //end: '2017-04-05 14:00'
	}, {
		id: 8,
		title: 'Astronomy',
		start: 'Fri 02:00',//start: '2017-04-05 02:00',
		end: 'Fri 03:00' //end: '2017-04-05 03:00'
	}, {
		id: 9,
		title: 'Anatomy',
		start: 'Thu 01:00', //start: '2017-04-05 01:00',
		end: 'Thu 03:00' //end: '2017-04-05 03:00'
	}, {
		id: 10,
		title: 'History',
		start: 'Mon 04:00',//start: '2017-04-05 04:00',
		end: 'Mon 06:00' //end: '2017-04-05 06:00'
	}];


	(function () {
		/**
		 * Colors array, you can change or add new colors
		 * @type {string[]}
		 */
		var arrColors = ['aqua', 'lightcoral', 'grey', 'fuchsia', 'green',
			'lime', 'mediumaquamarine', 'crimson', 'olive', 'orange', 'rebeccapurple', 'lightblue',
			'silver', 'teal', 'yellow'];

		var templater = function (template, data) {
			var html = '';
			for (var k in data) {
				html = template.split('{{' + k + '}}').join(data[k]);
				template = html;
			}
			return html;
		};

		var generateDate = function (indexDay) {

			var mD = moment().day(indexDay),
				date = mD.toDate(),
				values;

			date = date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

			date = new Date(date);

			values = [date.getDate(), date.getMonth() + 1];
			for (var id in values) {
				values[id] = values[id].toString().replace(/^([0-9])$/, '0$1');
			}

			return date.getFullYear() + '-' + values[1] + '-' + values[0];


		};

		var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		/**
		 * html template for list of task
		 * @type {string}
		 */
		var editViewListHtml = '<ul class="bottom-ul list-unstyled">',
			listItem = '<li>' +
				'<label class="radio-inline">' +
				'<input type="radio" name="optradio" class="{{title}}" data-task="{{title}}" data-color="{{color}}">&nbsp;' +
				'<span class="btn custom-button" style="background:{{color}};width:257px">{{title}}</span>' +
				'</label>' +
				'</li><br>';

		/**
		 * loop which generate list of task
		 */
		for (var i = 0; i < scheduleJson.length; i++) {
			if (daysOfWeek.indexOf(scheduleJson[i]['start'].split(' ')[0]) != -1 && daysOfWeek.indexOf(scheduleJson[i]['end'].split(' ')[0]) != -1) {
				scheduleJson[i]['start'] = generateDate(daysOfWeek.indexOf(scheduleJson[i]['start'].split(' ')[0])) + ' ' + scheduleJson[i]['start'].split(' ')[1];
				scheduleJson[i]['end'] = generateDate(daysOfWeek.indexOf(scheduleJson[i]['end'].split(' ')[0])) + ' ' + scheduleJson[i]['end'].split(' ')[1];
			}

			if (scheduleJson.length <= arrColors.length) {
				scheduleJson[i]['color'] = arrColors[i];
			} else {
				scheduleJson[i]['color'] = arrColors[i % (arrColors.length)];
			}
			editViewListHtml += templater(listItem, scheduleJson[i]);
		}

		editViewListHtml += '</ul>';
		$('#EditView').html(editViewListHtml);


		$(document).on('swiperight', function (e) {
			if($('.fc-agendaDay-view').length){
				$('.day-checked').next().click();
			}
		}).on('swipeleft', function (e) {
			if($('.fc-agendaDay-view').length){
				$('.day-checked').prev().click();
			}
		});
	})();


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


			setTimeout(function () {
				if (view.name === 'agendaDay') {
					$('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header tr th').each(function () {
						if ($(this).html().length) {
							var gv = 'fc-' + moment(view.title, 'MMMM DD, YYYY').format('ddd').toLowerCase();
							$(this).find('a').removeAttr('data-goto');
							$(this).find('a').attr('style', 'color:#ddd');
							if ($(this).hasClass(gv)) {
								$('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header tr th').removeClass('day-checked');
								$(this).addClass('day-checked');
							}
							$(this).unbind('click');
							$(this).click(function () {
								var f = $('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header tr').html();

								var d = new Date($(this).data('date'));
								var dateWithTimeZone = d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

								$('#calendar').fullCalendar('gotoDate', new Date(dateWithTimeZone));
								if ($(this).hasClass('day-checked')) {
									$('#calendar').fullCalendar('changeView', 'agendaWeek');
									$('.weekView').prop('checked', true);
								} else {
									$('#calendar').fullCalendar('changeView', 'agendaDay');
									$('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header table thead tr').html(f);
									$('.dayView').prop('checked', true);
								}

							});
						}
					});
				}
			}, 0);

		},
		navLinkDayClick: function (date, jsEvent) {
			var f = $('.fc-view.fc-agendaWeek-view.fc-agenda-view .fc-row.fc-widget-header tr').html();
			$('#calendar').fullCalendar('changeView', 'agendaDay');
			$('#calendar').fullCalendar('gotoDate', date);
			$('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header table thead tr').html(f);
			$('.dayView').prop('checked', true);
		},
		eventRender: function (event, element) {
			$('#addEventModal').data('event', event);
			element.bind('dblclick', function () {
				$('#addEventModal').modal('show');

				$('#fromTime').timepicker('setTime', moment(event.start).format('HH:mm A'));

				var ntime = moment(event.end, 'HH:mm A').format('HH:mm');
				if (ntime == '23:59') {
					$('#toTime').timepicker('setTime', '00:00 AM');
				} else {
					$('#toTime').timepicker('setTime', moment(event.end).format('HH:mm A'));
				}
				$('#exampleInputEmail1').text(event.title).css('background', event.color);
				$('#addEventModal').data('event', event);

				if (event.title) {
					$('.' + event.title).click();
				}

				$('input:radio').each(function () {
					var $this = $(this);
					var taskName = $this.data('task');
					var colorName = $this.data('color');
					if (taskName) {
						$('body').on('click', '.' + taskName, function () {
							$('#exampleInputEmail1').text(taskName).css('background', colorName);
							cr = colorName;
						})
					}
				});

			});
		},
		select: function (start, end, allDay) {
			$('#addEventModal').modal('show');

			$('input:radio').each(function () {
				var $this = $(this);
				var taskName = $this.data('task');
				var colorName = $this.data('color');
				if (taskName) {
					$('body').on('click', '.' + taskName, function () {
						$('#exampleInputEmail1').text(taskName).css('background', colorName);
						cr = colorName;
					})
				}
			});

			var title = $('#exampleInputEmail1').text();
			$('#fromTime').timepicker('setTime', moment(start).format('HH:mm A'));
			$('#toTime').timepicker('setTime', moment(end).format('HH:mm A'));

			var addData;
			// if (title) {
			addData = {
				id: scheduleJson.length + 1,
				title: title,
				start: start,
				end: end
			};

			scheduleJson.push(addData);
			$('#calendar').fullCalendar('renderEvent', addData, true);
			$('#calendar').fullCalendar('unselect');
			// }
			//     // --
			//     // POST request send in webservice
			console.log('Add Json Object ', scheduleJson);
		},
		eventDrop: function (event, delta, minuteDelta, allDay, revertFunc) {

			for (var key in scheduleJson) {
				if (scheduleJson[key].id == event.id) {
					scheduleJson.splice(key, 1);
				}
			}

			var setEvent = {};
			setEvent.id = event.id;
			setEvent.title = event.title;
			setEvent.start = moment(event.start.format()).format('YYYY-MM-DD HH:mm');
			setEvent.end = moment(event.end.format()).format('YYYY-MM-DD HH:mm');
			setEvent.color = event.color;

			scheduleJson.push(setEvent);
			$('#calendar').fullCalendar('rendarEvent', setEvent);

			// --
			// Drag and Drop request send in webservice
			console.log('Drag and Drop ', scheduleJson);

		},
		events: scheduleJson
	});


	/**************************
	 Edit Task
	 */
	$('.editEventBtn').click(function (e) {

		e.preventDefault();

		var title = $('#exampleInputEmail1').text();
		if (!title) {
			alert('Select task for list below');
			return;
		}

		var setEvent = $('#addEventModal').data('event');

		var start;
		var end;
		if ($('.from-time').val()) {
			var date = moment(setEvent.start).format('YYYY-MM-DD');
			var time = moment($('.from-time').val(), 'HH:mm A').format('HH:mm');
			var d = date + ' ' + time;
			start = moment(d).format('YYYY-MM-DD HH:mm');
		} else {
			start = setEvent.start;
		}

		if ($('.to-time').val()) {
			var edate = moment(setEvent.end).format('YYYY-MM-DD');
			var etime = moment($('.to-time').val(), 'HH:mm A').format('HH:mm');
			if (etime == '00:00') {
				etime = '23:59';
			}
			var dd = edate + ' ' + etime;

			end = moment(dd).format('YYYY-MM-DD kk:mm');
		} else {
			end = setEvent.end;
		}

		var ff = moment($('.to-time').val(), 'HH:mm A').format('HH:mm');
		if (ff == '00:00') {
			ff = '23:59';
		}

		if (moment($('.from-time').val(), 'HH:mm A').format('HH:mm') > ff) {
			alert('start or end time wrong for today');
			return;
		}

		setEvent.title = title;
		setEvent.start = start;
		setEvent.end = end;
		setEvent.color = (cr) ? cr : setEvent.color;

		$('#calendar').fullCalendar('updateEvent', setEvent);

		for (var key in scheduleJson) {
			if (scheduleJson[key].id == setEvent.id) {
				scheduleJson[key].id = setEvent.id;
				scheduleJson[key].title = title;
				scheduleJson[key].start = scheduleJson[key].start;
				scheduleJson[key].end = scheduleJson[key].end;
			}
		}

		// --
		// PUT request send in webservice
		console.log('Update Json Object ', scheduleJson);

		$('#addEventModal').modal('hide');
		$('#exampleInputEmail1').text('');
		$('#exampleInputEmail1').attr('style', 'background:none');
		$('.from-time').val('');
		cr = '';
		$('.to-time').val('');
		start = '';
		end = '';
	});


	/**************************
	 Delete Task
	 */

	$('.deleteEventBtn').click(function (e) {
		e.preventDefault();

		var deleteEvent = $('#addEventModal').data('event');
		if ($('#exampleInputEmail1').text() == deleteEvent.title) {
			for (var key in scheduleJson) {
				if (scheduleJson[key].id == deleteEvent.id) {
					scheduleJson.splice(key, 1);
				}
			}
			$('#calendar').fullCalendar('removeEvents', deleteEvent.id);
		}

		$('#addEventModal').modal('hide');
		$('#exampleInputEmail1').text('');
		$('#exampleInputEmail1').attr('style', 'background:none');
	});

	$('.cancelBtn').click(function () {
		$('#exampleInputEmail1').attr('style', 'background:none');
		$('#exampleInputEmail1').text('');

		var cancelEvent = $('#addEventModal').data('event');
		if (!cancelEvent.title) {
			for (var key in scheduleJson) {
				if (scheduleJson[key].id == cancelEvent.id) {
					scheduleJson.splice(key, 1);
				}
			}
			$('#calendar').fullCalendar('removeEvents', cancelEvent.id);
		}
	});


	$('.dayView').click(function () {
		var f = $('.fc-view.fc-agendaWeek-view.fc-agenda-view .fc-row.fc-widget-header tr').html();
		$('#calendar').fullCalendar('changeView', 'agendaDay');
		$('#calendar').fullCalendar('gotoDate', new Date());
		$('.fc-view.fc-agendaDay-view.fc-agenda-view .fc-row.fc-widget-header table thead tr').html(f);
		// $('.fc-agendaDay-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right').click();
		$('.dayView').prop('checked', true);

		switchView();
	});

	$('.weekView').click(function () {
		$('.fc-agendaWeek-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right').click();
		switchView();
	});


	var switchView = function () {
		var arrayUIDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
		for (var m = 0; m < arrayUIDays.length; m++) {
			var dim = '.fc-day-header.fc-widget-header.fc-' + arrayUIDays[m] + ' a';

			$(dim).click(function () {
				$('.dayView').prop('checked', true);
			});
		}
	}


	switchView();

	$("input[type='radio']").checkboxradio();
	$("input[type='radio']").checkboxradio("refresh");
});