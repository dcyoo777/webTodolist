import './EditTaskView.scss'
import { useCallback } from 'react';

const inputKeys = [
  {
    key: 'title',
    label: 'Title',
    type: 'text'
  },
  {
    key: 'content',
    label: 'Content',
    type: 'textarea'
  },
  {
    key: 'color',
    label: 'Color',
    type: 'color'
  },
  {
    key: 'startDate',
    label: 'Start Date',
    type: 'datetime-local'
  },
  {
    key: 'endDate',
    label: 'End Date',
    type: 'datetime-local'
  },
]

const EditTaskView = ({inputs, setInputs}) => {
  const onChangeInputs = useCallback((e) => {
    const {name, value} = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }))
  }, [setInputs])

  return <>
    {inputKeys.map(inputKey => <div key={inputKey.key} className='edit-task-row'>
      <label className={'edit-task-row-label'}>{inputKey.label}</label>
      {inputKey.type === 'textarea' && <textarea className={`edit-task-row-${inputKey.key}`} 
        name={inputKey.key} 
        value={inputs[inputKey.key] ?? ''}
        onChange={onChangeInputs}
      />}
      {inputKey.type !== 'textarea' && <input className={`edit-task-row-${inputKey.key}`} 
        type={inputKey.type}
        name={inputKey.key} 
        value={inputs[inputKey.key] ?? ''}
        onChange={onChangeInputs}
      />}
    </div>)}
  </>
}

export default EditTaskView
