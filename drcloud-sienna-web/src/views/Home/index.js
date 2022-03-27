import React, { useState, useMemo } from 'react';

import { BookingStepId } from '@utils/constants';
import Welcome from './containers/Welcome';
import Success from './containers/Success';
import SelectClinic from './containers/SelectClinic';
import SelectPatient from './containers/SelectPatient';
import CreatePatient from './containers/CreatePatient';
import CreateAppointment from './containers/CreateAppointment';
import ConfirmAppointment from './containers/ConfirmAppointment';

const Home = () => {
  const [data, setData] = useState({});

  const [currentStep, setCurrentStep] = useState(BookingStepId.welcome);

  const renderContent = useMemo(() => {
    switch (currentStep) {
      case BookingStepId.welcome:
        return <Welcome setCurrentStep={setCurrentStep} setData={setData} />;
      case BookingStepId.selectClinic:
        return <SelectClinic data={data} setData={setData} setCurrentStep={setCurrentStep} />;
      case BookingStepId.selectPatient:
        return <SelectPatient data={data} setData={setData} setCurrentStep={setCurrentStep} />;

      case BookingStepId.createPatient:
        return <CreatePatient data={data} setData={setData} setCurrentStep={setCurrentStep} />;

      case BookingStepId.createAppointment:
        return <CreateAppointment data={data} setData={setData} setCurrentStep={setCurrentStep} />;

      case BookingStepId.confirmAppointment:
        return <ConfirmAppointment data={data} setData={setData} setCurrentStep={setCurrentStep} />;

      case BookingStepId.success:
        return <Success setCurrentStep={setCurrentStep} />;
      default:
        break;
    }
    return <></>;
  }, [currentStep, data]);

  return <>{renderContent}</>;
};

export default Home;
