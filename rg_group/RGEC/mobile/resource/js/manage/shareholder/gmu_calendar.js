/*widget
calendar calendar module*/
(function(gmu,$,undefined){var monthNames=["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"],dayNames=["日","一","二","三","四","五","六"],offsetRE=/^(\+|\-)?(\d+)(M|Y)$/i,getDaysInMonth=function(year,month){return 32-new Date(year,month,32).getDate()},getFirstDayOfMonth=function(year,month){return new Date(year,month,1).getDay()},formatNumber=function(val,len){var num=""+val;while(num.length<len){num="0"+num}return num},getVal=function(elem){return elem.is('select, input')?elem.val():elem.attr('data-value')},prototype;gmu.define('Calendar',{options:{date:null,firstDay:1,maxDate:null,minDate:null,swipeable:false,monthChangeable:false,yearChangeable:false},_init:function(){this.on('ready',function(){var opts=this._options,el=this._container||this.$el,eventHandler=$.proxy(this._eventHandler,this);this.minDate(opts.minDate).maxDate(opts.maxDate).date(opts.date||new Date()).refresh();el.addClass('ui-calendar').on('click',eventHandler).highlight();opts.swipeable&&el.on('swipeLeft swipeRight',eventHandler)})},_create:function(){var $el=this.$el;if(!$el){$el=this.$el=$('<div>')}$el.appendTo(this._options['container']||($el.parent().length?'':document.body))},_eventHandler:function(e){var opts=this._options,root=(this._container||this.$el).get(0),match,target,cell,date,elems;switch(e.type){case'swipeLeft':case'swipeRight':return this.switchMonthTo((e.type=='swipeRight'?'-':'+')+'1M');case'change':elems=$('.ui-calendar-header .ui-calendar-year, '+'.ui-calendar-header .ui-calendar-month',this._el);return this.switchMonthTo(getVal(elems.eq(1)),getVal(elems.eq(0)));default:target=e.target;if((match=$(target).closest('.ui-calendar-calendar tbody a',root))&&match.length){e.preventDefault();cell=match.parent();this._option('selectedDate',date=new Date(cell.attr('data-year'),cell.attr('data-month'),match.text()));this.trigger('select',date,$.calendar.formatDate(date),this);this.refresh()}else if((match=$(target).closest('.ui-calendar-prev, .ui-calendar-next',root))&&match.length){e.preventDefault();this.switchMonthTo((match.is('.ui-calendar-prev')?'-':'+')+'1M')}}},_option:function(key,val){var opts=this._options,date,minDate,maxDate;if(val!==undefined){switch(key){case'minDate':case'maxDate':opts[key]=val?$.calendar.parseDate(val):null;break;case'selectedDate':minDate=opts.minDate;maxDate=opts.maxDate;val=$.calendar.parseDate(val);val=minDate&&minDate>val?minDate:maxDate&&maxDate<val?maxDate:val;opts._selectedYear=opts._drawYear=val.getFullYear();opts._selectedMonth=opts._drawMonth=val.getMonth();opts._selectedDay=val.getDate();break;case'date':this._option('selectedDate',val);opts[key]=this._option('selectedDate');break;default:opts[key]=val}opts._invalid=true;return this}return key=='selectedDate'?new Date(opts._selectedYear,opts._selectedMonth,opts._selectedDay):opts[key]},switchToToday:function(){var today=new Date();return this.switchMonthTo(today.getMonth(),today.getFullYear())},switchMonthTo:function(month,year){var opts=this._options,minDate=this.minDate(),maxDate=this.maxDate(),offset,period,tmpDate;if(Object.prototype.toString.call(month)==='[object String]'&&offsetRE.test(month)){offset=RegExp.$1=='-'?-parseInt(RegExp.$2,10):parseInt(RegExp.$2,10);period=RegExp.$3.toLowerCase();month=opts._drawMonth+(period=='m'?offset:0);year=opts._drawYear+(period=='y'?offset:0)}else{month=parseInt(month,10);year=parseInt(year,10)}tmpDate=new Date(year,month,1);tmpDate=minDate&&minDate>tmpDate?minDate:maxDate&&maxDate<tmpDate?maxDate:tmpDate;month=tmpDate.getMonth();year=tmpDate.getFullYear();if(month!=opts._drawMonth||year!=opts._drawYear){this.trigger('monthchange',opts._drawMonth=month,opts._drawYear=year,this);opts._invalid=true;this.refresh()}return this},refresh:function(){var opts=this._options,el=this._container||this.$el,eventHandler=$.proxy(this._eventHandler,this);if(!opts._invalid){return}$('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a',el).highlight();$('.ui-calendar-header select',el).off('change',eventHandler);el.empty().append(this._generateHTML());$('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a',el).highlight('ui-state-hover');$('.ui-calendar-header select',el).on('change',eventHandler);opts._invalid=false;return this},destroy:function(){var el=this._container||this.$el,eventHandler=this._eventHandler;$('.ui-calendar-calendar td:not(.ui-state-disabled)',el).highlight();$('.ui-calendar-header select',el).off('change',eventHandler);el.remove();return this.$super('destroy')},_generateHTML:function(){var opts=this._options,drawYear=opts._drawYear,drawMonth=opts._drawMonth,tempDate=new Date(),today=new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate()),minDate=this.minDate(),maxDate=this.maxDate(),selectedDate=this.selectedDate(),html='',i,j,firstDay,day,leadDays,daysInMonth,rows,printDate;firstDay=(isNaN(firstDay=parseInt(opts.firstDay,10))?0:firstDay);html+=this._renderHead(opts,drawYear,drawMonth,minDate,maxDate)+'<table  class="ui-calendar-calendar"><thead><tr>';for(i=0;i<7;i++){day=(i+firstDay)%7;html+='<th'+((i+firstDay+6)%7>=5?' class="ui-calendar-week-end"':'')+'>'+'<span>'+dayNames[day]+'</span></th>'}html+='</thead></tr><tbody><tr class="ui-calendar-gap">'+'<td colspan="7"> </td></tr>';daysInMonth=getDaysInMonth(drawYear,drawMonth);leadDays=(getFirstDayOfMonth(drawYear,drawMonth)-firstDay+7)%7;rows=Math.ceil((leadDays+daysInMonth)/7);printDate=new Date(drawYear,drawMonth,1-leadDays);for(i=0;i<rows;i++){html+='<tr>';for(j=0;j<7;j++){html+=this._renderDay(j,printDate,firstDay,drawMonth,selectedDate,today,minDate,maxDate);printDate.setDate(printDate.getDate()+1)}html+='</tr>'}html+='</tbody></table>';return html},_renderHead:function(data,drawYear,drawMonth,minDate,maxDate){var html='<div class="ui-calendar-header">',lpd=new Date(drawYear,drawMonth,-1),fnd=new Date(drawYear,drawMonth+1,1),i,max;html+='<a class="ui-calendar-prev'+(minDate&&minDate>lpd?' ui-state-disable':'')+'" href="#"><<</a><div class="ui-calendar-title">';if(data.yearChangeable){html+='<select class="ui-calendar-year">';for(i=Math.max(1970,drawYear-10),max=i+20;i<max;i++){html+='<option value="'+i+'" '+(i==drawYear?'selected="selected"':'')+'>'+i+'年</option>'}html+='</select>'}else{html+='<span class="ui-calendar-year" data-value="'+drawYear+'">'+drawYear+'年'+'</span>'}if(data.monthChangeable){html+='<select class="ui-calendar-month">';for(i=0;i<12;i++){html+='<option value="'+i+'" '+(i==drawMonth?'selected="selected"':'')+'>'+monthNames[i]+'</option>'}html+='</select>'}else{html+='<span class="ui-calendar-month" data-value="'+drawMonth+'">'+monthNames[drawMonth]+'</span>'}html+='</div><a class="ui-calendar-next'+(maxDate&&maxDate<fnd?' ui-state-disable':'')+'" href="#">>></a></div>';return html},_renderDay:function(j,printDate,firstDay,drawMonth,selectedDate,today,minDate,maxDate){var otherMonth=(printDate.getMonth()!==drawMonth),unSelectable;unSelectable=otherMonth||(minDate&&printDate<minDate)||(maxDate&&printDate>maxDate);return"<td class='"+((j+firstDay+6)%7>=5?"ui-calendar-week-end":"")+(unSelectable?" ui-calendar-unSelectable ui-state-disabled":"")+(otherMonth||unSelectable?'':(printDate.getTime()===selectedDate.getTime()?" ui-calendar-current-day":"")+(printDate.getTime()===today.getTime()?" ui-calendar-today":""))+"'"+(unSelectable?"":" data-month='"+printDate.getMonth()+"' data-year='"+printDate.getFullYear()+"'")+">"+(otherMonth?" ":(unSelectable?"<span class='ui-state-default'>"+printDate.getDate()+"</span>":"<a class='ui-state-default"+(printDate.getTime()===today.getTime()?" ui-state-highlight":"")+(printDate.getTime()===selectedDate.getTime()?" ui-state-active":"")+"' href='#'>"+printDate.getDate()+"</a>"))+"</td>"}});prototype=gmu.Calendar.prototype;$.each(['maxDate','minDate','date','selectedDate'],function(i,name){prototype[name]=function(val){return this._option(name,val)}});//@todo 支持各种格式
$.calendar={parseDate:function(obj){var dateRE=/^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;return Object.prototype.toString.call(obj)==='[object Date]'?obj:dateRE.test(obj)?new Date(parseInt(RegExp.$1,10),parseInt(RegExp.$2,10)-1,parseInt(RegExp.$3,10)):null},formatDate:function(date){return date.getFullYear()+'-'+formatNumber(date.getMonth()+1,2)+'-'+formatNumber(date.getDate(),2)}}})(gmu,gmu.$);
