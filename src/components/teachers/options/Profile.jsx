import React from 'react'
import UpdatePassword from '../../UpdatePassword'

export default function Profile(props) {
    return (
        <div className="w-100 mt-5 mb-5">
            {props.teacher?.name ? <h1 className='display-6 mb-4'>Hello {props.teacher?.gender.toLowerCase() === 'male' ? 'Mr.' : 'Mrs.'} {props.teacher.name}</h1> : null}
            <h5 className=' mb-5'>Email: {props.teacher?.email}</h5>
            <UpdatePassword />
        </div>
    )
}
