import { useCallback, useState } from 'react'
import { changeServerDomain, setTodolistServerInterceptors_request } from 'src/server/todolist/todolistServer'
import TodoList from '../3_molecules/TodoList'
import './Home.scss'

export default function Home() {
    const [inputs, setInputs] = useState({apiKey: '', domain: ''})
    const [isReady, setIsReady] = useState(false)

    const onChangeInputs = useCallback((e) => {
        const {name, value} = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }, [setInputs])

    const onClickApiKeySubmit = useCallback(() => {
        setTodolistServerInterceptors_request(inputs.apiKey)
        setIsReady(true)
    }, [inputs])

    const onClickDomainSubmit = useCallback(() => {
        changeServerDomain(inputs.domain)
        setIsReady(true)
    }, [inputs])

    return (
        <div id='home'>
            {!isReady && <div className='init'>
                <div className='init-row'>
                    <label className='init-label'>Api Key</label>
                    <input name={'apiKey'} value={inputs.apiKey} onChange={onChangeInputs}/>
                    <button className='init-submit' onClick={onClickApiKeySubmit}>Submit</button>
                </div>
                <div className='init-row'>
                    <label className='init-label'>My Domain</label>
                    <input name={'domain'} value={inputs.domain} onChange={onChangeInputs}/>
                    <button className='init-submit' onClick={onClickDomainSubmit}>Submit</button>    
                </div>
            </div>}
            {isReady && <TodoList isReady={isReady}/>}
        </div>
    )
}
