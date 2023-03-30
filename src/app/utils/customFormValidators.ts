import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Can be used for Validators for a Form.
 */
export default class CustomFormValidators {
    /**
     * Form validator: Search in the form control (sourceControlValue) for forbidden words stored in other form control fields (targetControlsNames).
     * @param sourceControlName FormControl name with the text that will be analysed for forbidden words, eg. 'password'
     * @param targetControlsNames FormConntrol names with the forbidden words. eg. 'firstName', 'lastName' 
     * @returns ValidationErrors or null 
     */
    static forbiddenValues(sourceControlName: string, targetControlsNames: string[], error: ValidationErrors): ValidatorFn {
        return (controls: AbstractControl) => {
            if (!controls || !targetControlsNames || targetControlsNames.length === 0) {
                return null;
            }

            const sourceControl = controls.get(sourceControlName);
            if (!sourceControl || !sourceControl?.value) {
                return null;
            }
            const sourceControlValue = sourceControl.value.toLowerCase();

            //get all forbidden words that are found in sourceControlValue, use targetControlsNames formfields values as forbidden words:
            const equalSourceControlValues = CustomFormValidators.getForbiddenWords(controls, sourceControlValue, targetControlsNames);

            const isValid = equalSourceControlValues.length === 0;
            if (isValid) {
                return null;
            }

            // add error to form control and keep existing:
            CustomFormValidators.addErrorToFormControl(sourceControl, error);

            return null;
        };
    };

    /**
     * Search in the form control for forbidden words in sourceControlValue.
     * @param controls all form controls
     * @param sourceControlValue FormControl name with the text that will be analysed for forbidden words, eg. 'password'
     * @param targetControlsNames FormConntrol names with the forbidden words. eg. 'firstName', 'lastName' 
     * @returns all forbidden words that are found in sourceControlValue
     */
    private static getForbiddenWords(controls: AbstractControl<any, any>, sourceControlValue: any, targetControlsNames: string[]) {
        return targetControlsNames.map(targetControlName => {
            const targetControlValue = (controls.get(targetControlName)?.value as string).toLowerCase();
            const isEqualValue = targetControlValue !== '' && sourceControlValue === targetControlValue;
            return isEqualValue ? targetControlValue : (undefined as any) as string;
        }).filter(x => !!x);
    }

    /**
     *  add error to form control and keep existing errors. This is needed otherwise the other form control errors are removed.
     * @param sourceControl FormControl that will be used to add the errors 
     * @param error 
     */
    private static addErrorToFormControl(sourceControl: AbstractControl<any, any>, error: ValidationErrors): void {
        const existingErrors = sourceControl.errors as ValidationErrors;
        const keys = Object.keys(error);
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const value = error[key];
            existingErrors[key] = value;
        }
    }
}

