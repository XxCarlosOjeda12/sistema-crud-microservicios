import { useState } from 'react';

const useForm = (initialValues, validationFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    if (validationFn) {
      const validationErrors = validationFn(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        callback(values);
      }
    } else {
      callback(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFormValues = (newValues) => {
    setValues(newValues);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    setFormValues,
    setErrors
  };
};

export default useForm;