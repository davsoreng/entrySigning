export default {
    routes : [
        //OBTENER TODAS LOS TIME-ENTRIES + POR ID DE REGISTRO
        {
            method:"GET",
            path:"/v1/time-entries/:id?",
            handler:"time-entrie.getTimeEntries"
        },
        //CREAR ORGANIZATION MEMBER
/*         {
            method:"POST",
            path:"/v1/time-entries",
            handler:"time-entrie.createTimeEntries"
        }, */
        //OBTENER TIME ENTRIES DE 1 MISMO USR
        {
            method:"GET",
            path:"/v1/members/:id/time-entries",
            handler:"time-entrie.getTimeEntriesByMember"
        },
    ]
}