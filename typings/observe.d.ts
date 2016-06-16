interface ChangeObserver {
  added?(doc:any):any,
  changed?(oldDoc:any, newDoc:any):any,
  removed?(oldDoc:any):any
}
