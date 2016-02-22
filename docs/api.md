
# API 说明

- order: 2

---

## 默认配置说明 

### container *body*

容器，与 `insert` 配合使用，设置为 `null` 则不执行插入

### classPrefix *ue-component*

主元素的className

### contentRole *content*

content 区域的 data-role 值，与 `children` 结合使用

### css *{}*

需要设置到主元素的 CSS 样式

### attr *{}*

需要设置到主元素的属性表

### template *null*

组件的模板

### templateOptions *null*

template 执行时的options参数

### data *{}*

模板数据，与 `template` 结合使用

### delegates *{}*

配置事件代理

### element *&lt;div&gt;&lt;/div&gt;*

widget 主元素

### insert

将主元素插入到 DOM

### trigger

触发器

## 方法说明

## $ `.$([selector])`

寻找 element 后代，参数为空时，返回 element 

## css `.css([arguments])`

等同于 instace.element.css

## attr `.attr([arguments])`

等同于 instace.element.attr

## role `.role(name)`

获取 role 对应的元素，通过 [data-role=xxx]

## data `.data(key, value, override)`

获取模板 data，基于 `option` 方法

## initCnE `.initCnE()`

初始化 `container` 与 `element`

## initDnV `.initDnV()`

初始化 `document` 与 `viewport`


存取初始化后的数据/参数，支持多级存取

## initDelegates `.initEvents()`

事件代理，绑定在 element 上

## initTrigger `.initTrigger()`

显示触发器

## initChildren `.initChildren()`

自动执行的设置函数，预留用于子类覆盖

## render `.render()`

解析内容，将 elemnt 插入到 container

## destroy `.destroy()`

销毁当前组件实例
