import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DatePicker.css';
import Test from './Test';

class DatePicker extends Component {
	constructor(props) {
		super(props);

		this.monthListSelectedItem = React.createRef();

		this.constants = {
			IN_BLACK_LIST: 'inBlackList',
			NEXT_TO_BLACK_LIST: 'nextToBlackList',
			NOT_IN_BLACK_LIST: 'notInBlackList',
			DAY_NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			MONTH_NAMES: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
				'October', 'November', 'December'],
			DATE_FORMAT: 'ddd, mmm dd yyyy',
			TITLE_DATE_FORMAT: 'mmmm yyyy',
			CLASS_NAMES: {
				DAY: 'day',
				NORMAL: 'day-normal',
				EMPTY: 'day-empty',
				DISABLED: 'day-disabled',
				IN_BLACK_LIST: 'day-in-black-list',
				NEXT_TO_DISABLED: 'day-next-to-disabled',
				WEEK_END: 'day-week-end',
				TODAY: 'day-today',
				SPECIAL: 'day-special',
				RANGE_START: 'day-range-start',
				RANGE_END: 'day-range-end',
				RANGE_START_END: 'day-range-start-end',
				IN_RANGE: 'day-in-range',
				SELECTION_START: 'day-selection-start',
				SELECTION_END: 'day-selection-end',
				SELECTION_START_END: 'day-selection-start-end',
				IN_SELECTION: 'day-in-selection',
				HOVER_START: 'day-hover-start',
				HOVER_END: 'day-hover-end',
				IN_HOVER: 'day-in-hover',
				DATE_PICKER_CONTAINER: 'date-picker-container',
				DATE_PICKER_TITLE: 'date-picker-title',
				DATE_PICKER: 'date-picker',
				MONTH_CONTAINER: 'month-container',
				MONTH_TITLE_CONTAINER: 'month-title-container',
				MONTH_TITLE_CONTENT: 'month-title-content',
				MONTH_TITLE: 'month-title',
				MONTH_TITLE_OPEN: 'month-title-open',
				MONTH_TITLE_CLOSED: 'month-title-closed',
				MONTH_LIST: 'month-list',
				MONTH_LIST_ITEM: 'month-list-item',
				MONTH_LIST_ITEM_SELECTED: 'month-list-item-selected',
				DAY_NAMES_CONTAINER: 'day-names-container',
				DAY_NAME: 'day-name',
				DAY_NAME_WEEK_END: 'day-name-week-end',
				DAYS_CONTAINER: 'days-container',
				MONTHS_CONTAINER: 'months-container',
				DATE_PICKER_DETAILS: 'date-picker-details',
				BTN_DISABLED: 'btn-disabled',
				BTN_PREVIOUS: 'btn-previous',
				BTN_NEXT: 'btn-next',
				BTN_TODAY: 'btn-today',
				BTN_CLEAR: 'btn-clear',
			}
		};

		this.weekEnds = this.getWeekEnds(props.weekEnds);
		this.isPopUp = !!props.isPopUp;
		this.isRangePicker = !!props.isRangePicker;
		this.showFooter = !!props.showFooter;
		this.showTitleDropDown = !!props.showTitleDropDown;
		this.numberOfSelectedDays = typeof props.numberOfSelectedDays === 'number' && !this.isRangePicker ?
			Math.max(Math.round(props.numberOfSelectedDays), 1) : 1;
		this.numberOfSelectedMSs = this.numberOfSelectedDays * 86400000;
		this.todayButton = typeof props.todayButton === 'string' && props.todayButton.length > 0 ?
			props.todayButton : !!props.todayButton;
		this.clearButton = typeof props.clearButton === 'string' && props.clearButton.length > 0 ?
			props.clearButton : !!props.clearButton;
		this.placeholder = typeof props.placeholder === 'string' ? props.placeholder : '';
		const now = new Date();
		this.firstMonthInMonthsList = this.isDate(props.firstMonthInMonthsList) ?
			this.toBeginningOfMonth(props.firstMonthInMonthsList) : this.toBeginningOfMonth(now);
		this.lastMonthInMonthsList = this.isDate(props.lastMonthInMonthsList) &&
			props.lastMonthInMonthsList - this.firstMonthInMonthsList >= 0 ?
			this.toBeginningOfMonth(props.lastMonthInMonthsList) : new Date(
				this.firstMonthInMonthsList.getFullYear(), this.firstMonthInMonthsList.getMonth() + 24, 1
			);
		this.dateFormat = this.isValidDateFormat(props.dateFormat) ? props.dateFormat : this.constants.DATE_FORMAT;
		this.monthTitleDateFormat = this.isValidDateFormat(props.monthTitleDateFormat) ?
			props.monthTitleDateFormat : this.constants.TITLE_DATE_FORMAT;
		this.containerClassName = typeof props.containerClassName === 'string' ? props.containerClassName :
			this.constants.CLASS_NAMES.DATE_PICKER_CONTAINER;
		this.numberOfShownMonths = typeof props.numberOfShownMonths !== 'number' ? 1 :
			Math.max(Math.round(props.numberOfShownMonths), 1);
		this.monthShift = typeof props.monthShift !== 'number' ? 1 :
			Math.min(Math.max(Math.round(props.monthShift), 1), this.numberOfShownMonths);
		this.dayNames = this.isArrayOfStrings(props.dayNames, 7) ? props.dayNames.slice(0, 7) : this.constants.DAY_NAMES;
		this.dayNameLength = typeof props.dayNameLength !== 'number' ? 3 :
			Math.max(Math.round(props.dayNameLength), 1);
		this.firstDayInWeekShift = typeof props.firstDayInWeekShift !== 'number' ? 0 :
			Math.min(Math.max(Math.round(props.firstDayInWeekShift), 0), 6);
		this.shiftedDayNames = this.dayNames.slice(this.firstDayInWeekShift).concat(
			this.dayNames.slice(0, this.firstDayInWeekShift)).map(name => name.slice(0, this.dayNameLength));
		this.monthNames = this.isArrayOfStrings(props.monthNames, 12) ? props.monthNames.slice(0, 12) : this.constants.MONTH_NAMES;
		this.preventBefore = this.isDate(props.preventBefore) ? this.toBeginningOfDay(props.preventBefore) : null;
		this.firstMonth = this.preventBefore ? this.toBeginningOfMonth(
			new Date(this.preventBefore.getFullYear(), this.preventBefore.getMonth(), this.preventBefore.getDate() + 1)
		) : null;
		const preventAfter = this.isDate(props.preventAfter) ? this.toBeginningOfDay(props.preventAfter) : null;
		this.preventAfter = !preventAfter ? null : this.preventBefore && preventAfter - this.preventBefore < 0 ?
			this.preventBefore : preventAfter;
		const lastMonth = this.preventAfter ? this.toBeginningOfMonth(
			new Date(this.preventAfter.getFullYear(), this.preventAfter.getMonth(), this.preventAfter.getDate() - 1)
		) : null;
		this.lastMonth = !lastMonth ? null : lastMonth - this.firstMonth < 0 ? this.firstMonth : lastMonth;
		this.blackList = this.isArrayOfDates(props.blackList) ?
			props.blackList.map(date => this.toBeginningOfDay(date)) : [];
		this.specialDates = this.isArrayOfSpecialDates(props.specialDates) ? props.specialDates.map(obj => ({
			title: obj.title,
			date: this.toBeginningOfDay(obj.date)
		})) : [];
		this.selectCallbackFN = typeof props.selectCallbackFN !== 'function' ? null : props.selectCallbackFN;
		this.dayElement = typeof props.dayElement !== 'function' ? null : props.dayElement;

		setTimeout(() => {
			window.addEventListener('click', this.windowClickHandler);
		}, 100);

		const _dateRangeStart = this.isDate(props.dateRangeStart) ? this.toBeginningOfDay(props.dateRangeStart) : null;
		const dateRangeStart = _dateRangeStart && (!this.preventBefore || _dateRangeStart - this.preventBefore > 0) &&
			(!this.preventAfter || this.preventAfter - _dateRangeStart >= this.numberOfSelectedMSs) &&
			this.inBlackList(_dateRangeStart) === this.constants.NOT_IN_BLACK_LIST ? _dateRangeStart : null;
		const dateRangeEnd = this.isRangePicker && this.isDate(props.dateRangeEnd) ?
			this.toBeginningOfDay(props.dateRangeEnd) : null;
		const thisMonth = this.toBeginningOfMonth(new Date());
		const _initialDate = this.isDate(props.initialDate) ? this.toBeginningOfMonth(props.initialDate) : null;
		const initialDate = _initialDate && (!this.firstMonth || _initialDate - this.firstMonth >= 0) &&
			(!this.lastMonth || _initialDate - this.lastMonth <= 0) ? _initialDate : dateRangeStart ?
			this.toBeginningOfMonth(dateRangeStart) : (!this.firstMonth || thisMonth - this.firstMonth >= 0) &&
			(!this.lastMonth || thisMonth - this.lastMonth <= 0) ? thisMonth :
			this.firstMonth ? this.firstMonth : this.lastMonth;
		this.state = {
			currentMonth: this.setCurrentMonth(initialDate),
			dateRangeStart: dateRangeStart,
			dateRangeEnd: dateRangeEnd && dateRangeStart && dateRangeEnd - dateRangeStart > 0 &&
				(!this.preventAfter || dateRangeEnd - this.preventAfter < 0) &&
				this.blackListIsNotInRange(dateRangeStart, dateRangeEnd) ? dateRangeEnd : null,
			isVisible: this.isPopUp ? false : true,
			monthList: null
		};

		if (props.propsConsoleLog) {
			const consoleObj = {
				numberOfSelectedDays: this.numberOfSelectedDays,
				containerClassName: this.containerClassName,
				todayButton: this.todayButton,
				clearButton: this.clearButton,
				placeholder: this.placeholder,
				firstMonthInMonthsList: this.firstMonthInMonthsList.toDateString(),
				lastMonthInMonthsList: this.lastMonthInMonthsList.toDateString(),
				numberOfShownMonths: this.numberOfShownMonths,
				monthShift: this.monthShift,
				isPopUp: this.isPopUp,
				isRangePicker: this.isRangePicker,
				showFooter: this.showFooter,
				showTitleDropDown: this.showTitleDropDown,
				dayNames: this.dayNames,
				shiftedDayNames: this.shiftedDayNames,
				weekEnds: this.shiftedDayNames.filter((name, index) => this.weekEnds.indexOf(index +
					this.firstDayInWeekShift) !== -1),
				monthNames: this.monthNames,
				dateFormat: this.dateFormat,
				monthTitleDateFormat: this.monthTitleDateFormat,
				preventBefore: this.preventBefore ? this.preventBefore.toDateString() : this.preventBefore,
				preventAfter: this.preventAfter ? this.preventAfter.toDateString() : this.preventAfter,
				blackList: this.blackList.map(date => date.toDateString()),
				specialDates: this.specialDates.map(obj => obj.date.toDateString() + ' (' + obj.title + ')'),
				dateRangeStart: this.state.dateRangeStart ? this.state.dateRangeStart.toDateString() :
					this.state.dateRangeStart,
				dateRangeEnd: this.state.dateRangeEnd ? this.state.dateRangeEnd.toDateString() : this.state.dateRangeEnd,
				initialDate: this.state.currentMonth ? this.state.currentMonth.toDateString() : this.state.currentMonth,	
				selectCallbackFN: this.selectCallbackFN ? this.selectCallbackFN.toString() : null,
				dayElement: this.dayElement ? this.dayElement.toString() : null
			};
			Object.keys(consoleObj).forEach(key => console.log(key + ':', consoleObj[key]));
		}

	}

	componentWillUnmount() {
		window.removeEventListener('click', this.windowClickHandler);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.monthList !== this.state.monthList && this.monthListSelectedItem.current) {
			this.monthListSelectedItem.current.scrollIntoView();
		}
	}

	windowClickHandler = () => {
		this.setState({
			isVisible: this.isPopUp ? false : true,
			monthList: null
		});
	};

	getWeekEnds = weekEnds => {
		if (!Array.isArray(weekEnds)) {
			return [];
		}
		for (let i = weekEnds.length - 1; i >= 0; i--) {
			if (typeof weekEnds[i] !== 'number') {
				return [];
			}
		}
		return weekEnds.slice(0);
	};

	isValidDateFormat = format => {
		if (typeof format !== 'string') {
			return false;
		}
		const length = format.length;
		format = format.replace(/yyyy|yy|mmmm|mmm|mm|m|dddd|ddd|dd|d/gmi, '');
		if (length === format.length || /[a-z]|\d/mi.test(format)) {
			return false;
		}
		return true;
	};

	dateToString = (date, format) => {
		const dateYear = date.getFullYear();
		const dateMonth = date.getMonth();
		const dateDate = date.getDate();
		const dateDay = (date.getDay() + 6) % 7;
		return format.replace(/yyyy|yy|mmmm|mmm|mm|m|dddd|ddd|dd|d/gmi, match => {
			match = match.toLowerCase();
			switch (match) {
				case 'yyyy':
					return dateYear + '';
				case 'yy':
					return (dateYear + '').slice(-2);
				case 'mmmm':
					return this.monthNames[dateMonth];
				case 'mmm':
					return this.monthNames[dateMonth].slice(0, 3);
				case 'mm':
					return ('0' + (dateMonth + 1)).slice(-2);
				case 'm':
					return dateMonth + 1 + '';
				case 'dddd':
					return this.dayNames[dateDay];
				case 'ddd':
					return this.dayNames[dateDay].slice(0, 3);
				case 'dd':
					return ('0' + dateDate).slice(-2);
				case 'd':
					return dateDate + '';
			}
		});
	};

	isArrayOfStrings = (arr, num) => {
		if (!Array.isArray(arr)) {
			return false;
		}
		for (let i=0; i<num; i++) {
			if (typeof arr[i] !== 'string') {
				return false;
			}
		}
		return true;
	};

	isArrayOfSpecialDates = arr => {
		if (!Array.isArray(arr)) {
			return false;
		}
		for (let i = arr.length - 1; i >= 0; i--) {
			if (!this.isDate(arr[i].date) || typeof arr[i].title !== 'string') {
				return false;
			}
		}
		return true;
	};

	isArrayOfDates = arr => {
		if (!Array.isArray(arr)) {
			return false;
		}
		for (let i = arr.length - 1; i >= 0; i--) {
			if (!this.isDate(arr[i])) {
				return false;
			}
		}
		return true;
	};

	isDate = date => Object.prototype.toString.call(date) === '[object Date]';

	getTitleOfSpecialDate = date => {
		const specialDates = this.specialDates;
		for (let i = specialDates.length - 1; i >= 0; i--) {
			if (specialDates[i].date - date === 0) {
				return specialDates[i].title;
			}
		}
		return null;
	};

	toBeginningOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

	toBeginningOfMonth = date => new Date(date.getFullYear(), date.getMonth(), 1);

	inBlackList = date => {
		let nextToBlackList = false;
		for (let i = this.blackList.length - 1; i >= 0; i--) {
			const difference = this.blackList[i] - date;
			if (difference === 0) {
				return this.constants.IN_BLACK_LIST;
			}
			if (!nextToBlackList && difference > 0 && difference < this.numberOfSelectedMSs) {
				nextToBlackList = true;
			}
		}
		if (nextToBlackList) {
			return this.constants.NEXT_TO_BLACK_LIST;
		}
		return this.constants.NOT_IN_BLACK_LIST;
	};

	createMonthList = date => {
		const list = [];
		let itrationDate = new Date(this.firstMonthInMonthsList.getFullYear(), this.firstMonthInMonthsList.getMonth(), 1);
		while(itrationDate - this.firstMonthInMonthsList >= 0 && itrationDate - this.lastMonthInMonthsList <= 0) {
			if (
				(!this.firstMonth || itrationDate - this.firstMonth >= 0) &&
				(!this.lastMonth || itrationDate - this.lastMonth <= 0)
			) {
				list.push({
					date: itrationDate,
					selected: itrationDate - date === 0
				});
			}
			itrationDate = new Date(itrationDate.getFullYear(), itrationDate.getMonth() + 1, 1);
		}
		return list;
	};

	setCurrentMonth = date => {
		if (
			this.lastMonth && 
			new Date(date.getFullYear(), date.getMonth() + this.numberOfShownMonths - 1, 1) - this.lastMonth > 0
		) {
			date = new Date(
				this.lastMonth.getFullYear(), this.lastMonth.getMonth() + 1 - this.numberOfShownMonths, 1
			);
		}
		if (this.firstMonth && date - this.firstMonth < 0) {
			date = new Date(this.firstMonth.getFullYear(), this.firstMonth.getMonth(), 1);
		}
		return date;
	};

	setSelection = (start, end) => {
		this.setState({
			dateRangeStart: start,
			dateRangeEnd: end,
			isVisible: this.isPopUp && (end || !this.isRangePicker) ? false : true
		});
		if (this.selectCallbackFN) {
			this.selectCallbackFN(start, end);
		}
	};

	blackListIsNotInRange = (start, end) => {
		for (let i=0; i<this.blackList.length; i++) {
			if (this.blackList[i] - start >= 0 && this.blackList[i] - end <= 0) {
				return false;
			}
		}
		return true;
	};

	datePickerClickHandler = e => {
		e.stopPropagation();
		this.setState({
			monthList: null
		});
	};

	dayEnterHandler = (date, className) => {
		if (
			className === this.constants.CLASS_NAMES.NORMAL && this.isRangePicker && this.state.dateRangeStart &&
			!this.state.dateRangeEnd && date - this.state.dateRangeStart > 0 &&
			this.blackListIsNotInRange(this.state.dateRangeStart, date)
		) {
			this.setState({dateHovered: date});
		}
	};

	dayLeaveHandler = () => {
		if (this.state.dateHovered) {
			this.setState({dateHovered: null});
		}
	};

	dayClickHandler = (date, className) => {
		if (className === this.constants.CLASS_NAMES.NORMAL) {
			let dateRangeStart = this.state.dateRangeStart;
			let dateRangeEnd = null;
			if (
				this.isRangePicker && dateRangeStart && !this.state.dateRangeEnd && date - dateRangeStart > 0 &&
				this.blackListIsNotInRange(dateRangeStart, date)
			) {
				dateRangeEnd = date;
			}
			else {
				dateRangeStart = date;
			}
			this.setSelection(dateRangeStart, dateRangeEnd);
		}
	};

	monthShiftHandler = shift => {
		const currentMonth = this.state.currentMonth;
		this.setState({
			currentMonth: this.setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + shift, 1))
		});
	};

	monthTitleClickHandler = (e, index) => {
		e.stopPropagation();
		this.setState({
			monthList: this.state.monthList === index ? null : index
		});
	};

	monthListItemClickHandler = (date, shift) => {
		this.setState({
			currentMonth: this.setCurrentMonth(new Date(date.getFullYear(), date.getMonth() - shift, 1))
		});
	};

	DatePickerToggle = e => {
		e.stopPropagation();
		this.setState({
			isVisible: !this.state.isVisible,
			monthList: null
		});
	};

	createDays = (year, month, today) => {
		const days = [];
		const firstDayInMonthPosition = (new Date(year, month, 1).getDay() + 6 - this.firstDayInWeekShift) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		for (let i=0; i<firstDayInMonthPosition + daysInMonth; i++) {
			const dayDate = i - firstDayInMonthPosition + 1;
			const itrationDate = new Date(year, month, dayDate);
			const inBlackList = this.inBlackList(itrationDate);
			const startDateToItrationDate = this.state.dateRangeStart ? itrationDate - this.state.dateRangeStart : null;
			if (startDateToItrationDate !== null && startDateToItrationDate % 86400000 !== 0) {
				console.log(dayDate, this.state.dateRangeStart, itrationDate)

			}
			const endDateToItrationDate = this.state.dateRangeEnd ? itrationDate - this.state.dateRangeEnd : null;
			const preventBeforeToItrationDate = this.preventBefore ? itrationDate - this.preventBefore : null;
			const preventAfterToItrationDate = this.preventAfter ? itrationDate - this.preventAfter : null;
			const dateHoveredToItrationDate = this.state.dateHovered ? itrationDate - this.state.dateHovered : null;
			const classNames = this.constants.CLASS_NAMES;
			const itrationTitle = this.getTitleOfSpecialDate(itrationDate);
			const itrationClassName1 = dayDate < 1 ? classNames.EMPTY :
				(this.preventBefore && preventBeforeToItrationDate <= 0) ||
				(this.preventAfter && preventAfterToItrationDate >= 0) ? classNames.DISABLED : inBlackList ===
				this.constants.IN_BLACK_LIST ? classNames.IN_BLACK_LIST : inBlackList ===
				this.constants.NEXT_TO_BLACK_LIST || (this.preventAfter && - preventAfterToItrationDate > 0 &&
				- preventAfterToItrationDate < this.numberOfSelectedMSs) ? classNames.NEXT_TO_DISABLED : classNames.NORMAL;
			const itrationClassName2 = dayDate > 0 && this.weekEnds.indexOf((i + this.firstDayInWeekShift) % 7) > -1 ?
				classNames.WEEK_END : null;
			const itrationClassName3 = dayDate > 0 && itrationDate - today === 0 ? classNames.TODAY : null;
			const itrationClassName4 = dayDate > 0 && itrationTitle !== null ? classNames.SPECIAL : null;







			
			const itrationClassName5 = dayDate < 1 ? null : this.state.dateRangeStart &&
				startDateToItrationDate === 0 ? (this.isRangePicker ? (this.state.dateRangeEnd ? classNames.RANGE_START :
				classNames.RANGE_START_END) : (this.numberOfSelectedDays === 1 ? classNames.SELECTION_START_END :
				classNames.SELECTION_START)) : this.state.dateRangeEnd && endDateToItrationDate === 0 ?
				classNames.RANGE_END : this.state.dateRangeEnd && startDateToItrationDate > 0 && endDateToItrationDate < 0 ?
				classNames.IN_RANGE : !this.isRangePicker && this.state.dateRangeStart && startDateToItrationDate > 0 &&
				startDateToItrationDate < this.numberOfSelectedMSs ? (startDateToItrationDate ===
				this.numberOfSelectedMSs - 86400000 ? classNames.SELECTION_END : classNames.IN_SELECTION) : null;
			const itrationClassName6 = dayDate <= 0 || !this.state.dateHovered || dateHoveredToItrationDate > 0 ||
				startDateToItrationDate < 0 ? null : startDateToItrationDate === 0 ? classNames.HOVER_START :
				dateHoveredToItrationDate === 0 ? classNames.HOVER_END : classNames.IN_HOVER;
			days.push(<div
				key={i}
				className={classNames.DAY + ' ' + itrationClassName1 +
					(itrationClassName2 ? ' ' + itrationClassName2 : '') +
					(itrationClassName3 ? ' ' + itrationClassName3 : '') +
					(itrationClassName4 ? ' ' + itrationClassName4 : '') +
					(itrationClassName5 ? ' ' + itrationClassName5 : '') +
					(itrationClassName6 ? ' ' + itrationClassName6 : '')}
				title={itrationTitle}
				onClick={() => this.dayClickHandler(itrationDate, itrationClassName1)}
				onMouseEnter={() => this.dayEnterHandler(itrationDate, itrationClassName1)}
				onMouseLeave={this.dayLeaveHandler}
			>{dayDate < 1 ? '' : this.dayElement ? this.dayElement(itrationDate) : dayDate}</div>);
		}
		return days;
	};

	createMonths = today => {
		const classNames = this.constants.CLASS_NAMES;
		const currentYear = this.state.currentMonth.getFullYear();
		const currentMonth = this.state.currentMonth.getMonth();
		const months = [];
		for (let i=0; i<this.numberOfShownMonths; i++) {
			const monthDate = new Date(currentYear, currentMonth + i, 1);
			if (!this.lastMonth || monthDate - this.lastMonth <= 0) {
				months.push(
					<div className={classNames.MONTH_CONTAINER} key={i}>
						{!this.showTitleDropDown ? <div className={classNames.MONTH_TITLE_CONTENT}>
							{this.dateToString(monthDate, this.monthTitleDateFormat)}
						</div> : <div className={classNames.MONTH_TITLE_CONTAINER}>
							<button
								className={classNames.MONTH_TITLE + ' ' + (this.state.monthList === i ?
									classNames.MONTH_TITLE_OPEN : classNames.MONTH_TITLE_CLOSED)}
								onClick={e => this.monthTitleClickHandler(e, i)}
							>{this.dateToString(monthDate, this.monthTitleDateFormat)}</button>
							{this.state.monthList !== i ? '' : <ul className={classNames.MONTH_LIST}>
								{this.createMonthList(monthDate).map((item, index) => <li
									key={index}
									className={classNames.MONTH_LIST_ITEM + (item.selected ? ' ' +
										classNames.MONTH_LIST_ITEM_SELECTED : '')}
									onClick={() => this.monthListItemClickHandler(item.date, i)}
									ref={item.selected ? this.monthListSelectedItem : null}
								>{this.dateToString(item.date, this.monthTitleDateFormat)}</li>)}
							</ul>}
						</div>}
						<div className={classNames.DAY_NAMES_CONTAINER}>
							{this.shiftedDayNames.map((day, index) => <div
								key={index}
								className={classNames.DAY_NAME + (this.weekEnds.indexOf((index + this.firstDayInWeekShift) % 7)
									=== -1 ? '' : ' ' + classNames.DAY_NAME_WEEK_END)}
							>{day}</div>)}
						</div>
						<div className={classNames.DAYS_CONTAINER}>
							{this.createDays(currentYear, currentMonth + i, today)}
						</div>
					</div>
				);
			}
		}
		return months;
	};

	render() {
		const classNames = this.constants.CLASS_NAMES;
		const today = this.toBeginningOfDay(new Date());
		const disablePreviousBTN = this.firstMonth && this.state.currentMonth - this.firstMonth <= 0;
		const disableNextBTN = this.lastMonth && new Date(this.state.currentMonth.getFullYear(),
			this.state.currentMonth.getMonth() + this.numberOfShownMonths - 1, 1) - this.lastMonth >= 0;
		const disableTodayBTN = (this.preventBefore && today - this.preventBefore <= 0) ||
			(this.preventAfter && today - this.preventAfter >= 0);




		const selectedDates = !this.state.dateRangeStart ? this.placeholder : this.dateToString(this.state.dateRangeStart,
			this.dateFormat) + (this.state.dateRangeEnd || (!this.isRangePicker && this.numberOfSelectedDays > 1) ?
			' - ' + (this.state.dateRangeEnd ? this.dateToString(this.state.dateRangeEnd, this.dateFormat) :
			this.dateToString(new Date(this.state.dateRangeStart.getFullYear(), this.state.dateRangeStart.getMonth(),
			this.state.dateRangeStart.getDate() + this.numberOfSelectedDays - 1), this.dateFormat)) : '');





		return <div className={this.containerClassName}>
			<Test />
			{this.isPopUp ? <div className={classNames.DATE_PICKER_TITLE} onClick={this.DatePickerToggle}>
				{selectedDates}
			</div> : null}
			{this.state.isVisible ? <div className={classNames.DATE_PICKER} onClick={this.datePickerClickHandler}>
				<div className={classNames.MONTHS_CONTAINER}>
					{this.createMonths(today)}
				</div>
				{this.showFooter ? <div className={classNames.DATE_PICKER_DETAILS}>{selectedDates}</div> : null}




				
				<button
					className={classNames.BTN_PREVIOUS + (disablePreviousBTN ? ' ' + classNames.BTN_DISABLED : '')}
					onClick={disablePreviousBTN ? null : () => this.monthShiftHandler(-this.monthShift)}
				></button>
				<button
					className={classNames.BTN_NEXT + (disableNextBTN ? ' ' + classNames.BTN_DISABLED : '')}
					onClick={disableNextBTN ? null : () => this.monthShiftHandler(this.monthShift)}
				></button>
				{this.todayButton ? <button
					className={classNames.BTN_TODAY + (disableTodayBTN ? ' ' + classNames.BTN_DISABLED : '')}
					onClick={() => this.setState({
						currentMonth: this.setCurrentMonth(this.toBeginningOfMonth(today))
					})}
				>{typeof this.todayButton === 'string' ? this.todayButton : ''}</button> : ''}
				{this.clearButton ? <button
					className={classNames.BTN_CLEAR + (!this.state.dateRangeStart ? ' ' + classNames.BTN_DISABLED : '')}
					onClick={!this.state.dateRangeStart ? null : () => this.setSelection(null, null)}
				>{typeof this.clearButton === 'string' ? this.clearButton : ''}</button> : ''}
			</div> : null}
		</div>;
	}
}

DatePicker.propTypes = {
	numberOfSelectedDays: PropTypes.number,
	containerClassName: PropTypes.string,
	dayNames: PropTypes.arrayOf(PropTypes.string),
	monthNames: PropTypes.arrayOf(PropTypes.string),
	blackList: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
	dateFormat: PropTypes.string,
	monthTitleDateFormat: PropTypes.string,
	firstDayInWeekShift: PropTypes.number,
	numberOfShownMonths: PropTypes.number,
	monthShift: PropTypes.number,
	isPopUp: PropTypes.bool,
	isRangePicker: PropTypes.bool,
	showFooter: PropTypes.bool,
	showTitleDropDown: PropTypes.bool,
	dayNameLength: PropTypes.number,
	preventBefore: PropTypes.instanceOf(Date),
	preventAfter: PropTypes.instanceOf(Date),
	dateRangeStart: PropTypes.instanceOf(Date),
	dateRangeEnd: PropTypes.instanceOf(Date),
	initialDate: PropTypes.instanceOf(Date),
	firstMonthInMonthsList: PropTypes.instanceOf(Date),
	lastMonthInMonthsList: PropTypes.instanceOf(Date),
	selectCallbackFN: PropTypes.func,
	dayElement: PropTypes.func,
	propsConsoleLog: PropTypes.bool,
	weekEnds: PropTypes.arrayOf(PropTypes.number),
	todayButton: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	clearButton: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	placeholder: PropTypes.string,
	specialDates: PropTypes.arrayOf(PropTypes.exact({
		title: PropTypes.string,
		date: PropTypes.instanceOf(Date)
	}))
};
export default DatePicker;