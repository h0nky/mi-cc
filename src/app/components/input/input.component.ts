import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mi-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
}]
})
export class InputComponent implements ControlValueAccessor {
 inputValue: string = '';
 @Input() placeholder: string = 'Placeholder'

 /**
  * Invoked when the model has been changed
  */
 onChange: (_: any) => void = (_: any) => {};

 /**
  * Invoked when the model has been touched
  */
 onTouched: () => void = () => {};

 constructor() {}

 /**
  * Method that is invoked on an update of a model.
  */
 updateChanges() {
     this.onChange(this.inputValue);
 }

 ///////////////
 // OVERRIDES //
 ///////////////

 /**
  * Writes a new item to the element.
  * @param value the value
  */
 writeValue(value: string): void {
     this.inputValue = value;
     this.updateChanges();
 }

 /**
  * Registers a callback function that should be called when the control's value changes in the UI.
  * @param fn
  */
 registerOnChange(fn: () => void): void {
     this.onChange = fn;
 }

 /**
  * Registers a callback function that should be called when the control receives a blur event.
  * @param fn
  */
 registerOnTouched(fn:  () => void): void {
     this.onTouched = fn;
  }
}