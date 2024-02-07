import Calendar from 'react-calendar'
import React, { useState, useEffect } from "react"
import '../../../assets/css/calendar.css'
import moment from 'moment'
import styled from "styled-components"
import { ScheduleList } from "../../../API/ScheduleAPI"
import { useParams } from "react-router-dom"
import ScheduleCreateModal from "../../Modals/ScheduleCreate"
import CalendarBox from "../calendar/CalendarBox"


function CalendarBar () {
    const [today, setToday] = useState(new Date())
    const { teamspaceIdx } = useParams()
    const [dates, setDates] = useState([])

    const handleScheduleCreate = async (newSchedule) => {
        try {
            console.log(newSchedule)
            const response = await ScheduleList(teamspaceIdx)
            setDates(response)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const info = async() => {
            try {
                const dateInfo = await ScheduleList(teamspaceIdx)
                setDates(dateInfo)
            } catch (err) {
                console.log(err)
            }
        }
        info()
    },[])


    return (
        <>
        <Container>
            <div className="schedule-box">
                <div className="title">
                    <h3>Schedule</h3>
                    <ScheduleCreateModal 
                        teamspaceId={teamspaceIdx}
                        onScheduleCreate={handleScheduleCreate}
                    />
                </div>
                <CalendarBox />
                <div className="today-wrapper">
                    <span className="today">TODAY </span>
                    <span className="day">{moment(today).format('MM/DD(ddd)')}</span>
                </div>
                <ul>
                    { dates && dates.length > 0 ? (
                        dates.map((schedule) => {
                            return (
                                <div className="content-box" key={schedule.scheduleIdx}>
                                    <li>
                                        {moment(schedule.startTime).format('MM/DD HH:mm')} - {moment(schedule.endTime).format('MM/DD HH:mm')}
                                        <div className="content">
                                            <p>{schedule.content} ({schedule.place})</p>
                                        </div>
                                    </li>
                                </div>
                            )
                        }) )
                        : (
                            <p>일정이 없습니다.</p>
                        )}
                </ul>
            </div>
        </Container>
        </>
    )
}

export default CalendarBar


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px;
    align-items: center;

    .schedule-box {
        color: white;
        background-color: #151C2C;
        border-radius: 20px;
        width: 20rem;
        height: 32rem;
        display: flex;
        flex-direction: column;
    }

    .title {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    .today-wrapper {
        display: flex;
        padding: 20px;
        margin-left: 20px;
    }

    .today {
        color: #F04D23;
        font-weight: bold;
        margin-right: 15px;
    }

    .day {
        color: #7d7e80;
        font-weight: bold;
    }

    .content {
        margin: 10px;
    }
`