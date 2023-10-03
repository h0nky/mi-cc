import { HttpHeaders } from "@angular/common/http";

export const getHttpHeaders = () => ({
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response'
  })