/***  Abel 特别声明：这里的覆盖遵循 若base.form中有该属性  本文件再次定义是无法覆盖的  ***/


export default [
  {
    weight: 0,
    type: 'textfield',
    input: true,
    key: 'label',
    label: '撒地方',
    hidden:true,  //显示隐藏该项
    placeholder: 'Field Label',
    tooltip: 'The label for this field that will appear next to it.',
    disabled:true,
    prefix:'test里',
    validate: {
      required: false
    }
  },
  {
    key: 'color',
    type: 'select',
    input: true,
    label: 'color',
    weight: 0,
    defaultValue:'yellow',
    placeholder:'input the color you want to set',
    tooltip:'this is a tooltip',
    data: {
      values: [
        { label: '红色', value: 'red' },
        { label: '黄色', value: 'yellow' },
        { label: 'blue', value: 'blue' },
        { label: '紫色', value: 'purple' },
        { label: '粉色', value: 'pink' },
      ]
    }
  }
];
