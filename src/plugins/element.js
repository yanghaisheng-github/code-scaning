import Vue from 'vue'

import { Button, Form, FormItem, Input, Checkbox, Row, Col, 
    Menu, MenuItem, Submenu, Tooltip, Dropdown, DropdownMenu, DropdownItem,
    Select, Option, DatePicker, TimePicker, cascader, Switch, CheckboxGroup,
    RadioGroup, Radio, Breadcrumb,  BreadcrumbItem, Table, TableColumn, Pagination, 
    Dialog, Message, Upload} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Tooltip)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(cascader)
Vue.use(Switch)
Vue.use(CheckboxGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Message)
Vue.use(Upload)

/* Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification; */
Vue.prototype.$message = Message;