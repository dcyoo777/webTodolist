import './EditCategoryView.scss'
import { useCallback } from 'react';

const inputKeys = [
  {
    key: 'name',
    label: 'Name',
    type: 'text'
  },
  {
    key: 'color',
    label: 'Color',
    type: 'color'
  }
]

const EditCategoryView = ({inputs, setInputs}) => {
  const onChangeInputs = useCallback((e) => {
    const {name, value} = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }))
  }, [setInputs])

  return <>
    {inputKeys.map(inputKey => <div key={inputKey.key} className='edit-category-row'>
      <label className={'edit-category-row-label'}>{inputKey.label}</label>
      {<input type={inputKey.type} className={`edit-category-row-${inputKey.key}`} 
        name={inputKey.key} 
        value={inputs[inputKey.key]}
        onChange={onChangeInputs}
      />}
    </div>)}
  </>
}

export default EditCategoryView
