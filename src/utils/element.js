import {
    Dialog,
    Pagination,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Input,
    InputNumber,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Button,
    ButtonGroup,
    Table,
    TableColumn,
    DatePicker,
    TimeSelect,
    TimePicker,
    Message,
    Breadcrumb,
    BreadcrumbItem,
    scrollbar,
    Badge,
    Tooltip,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Form,
    FormItem,
    Autocomplete,
    Row,
    Col,
    MessageBox,
    Tree,
    Cascader,
    CascaderPanel,
    Tabs,
    TabPane,
    Upload,
    //员工
    Drawer,
    Popover,
} from 'element-ui';

const element = {
    install: function (Vue) {
        // Vue.use(Dialog.name, Dialog);
        Vue.use(Dialog)
        Vue.use(Pagination);
        Vue.use(Menu);
        Vue.use(Submenu);
        Vue.use(MenuItem);
        Vue.use(MenuItemGroup);
        Vue.use(Input);
        Vue.use(InputNumber);
        Vue.use(Checkbox);
        Vue.use(CheckboxButton);
        Vue.use(CheckboxGroup);
        Vue.use(Switch);
        Vue.use(Select);
        Vue.use(Option);
        Vue.use(OptionGroup);
        Vue.use(Button);
        Vue.use(ButtonGroup);
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(DatePicker);
        Vue.use(TimeSelect);
        Vue.use(TimePicker);
        Vue.use(Breadcrumb);
        Vue.use(BreadcrumbItem);
        Vue.use(scrollbar);
        Vue.use(Badge);
        Vue.use(Tooltip);
        Vue.use(Dropdown);
        Vue.use(DropdownMenu);
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Autocomplete);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(DropdownItem);
        Vue.use(Tree);
        Vue.use(Cascader);
        Vue.use(CascaderPanel);
        Vue.use(Tabs);
        Vue.use(TabPane);
        Vue.use(Upload);
        Vue.use(Drawer);
        Vue.use(Popover);
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$message = Message;
    }
}

export default element