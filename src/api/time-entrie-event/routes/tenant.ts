export default {
    routes : [
        //OBTENER TODAS LOS TIME-ENTRIES-EVENT + POR ID DE REGISTRO
        {
            method:"GET",
            path:"/v1/time-entries-events/:id?",
            handler:"time-entrie-event.getTimeEntryEvent"
        },
        //CREAR TIME-ENTRIES-EVENT
        {
            method:"POST",
            path:"/v1/time-entries/start",
            handler:"time-entrie-event.startTimeEntriesEvent"
        },
        {
            method:"POST",
            path:"/v1/time-entries/:id/pause",
            handler:"time-entrie-event.pauseTimeEntriesEvent"
        },
        {
            method:"POST",
            path:"/v1/time-entries/:id/resume",
            handler:"time-entrie-event.resumeTimeEntriesEvent"
        },
        {
            method:"POST",
            path:"/v1/time-entries/:id/end",
            handler:"time-entrie-event.endTimeEntriesEvent"
        },
        //OBTENER TIME-ENTRIES-EVENT POR TIME-ENTRIE
        {
            method:"GET",
            path:"/v1/time-entries/:id/events",
            handler:"time-entrie-event.getTimeEntriesEveByEntrie"
        },
    ]
}