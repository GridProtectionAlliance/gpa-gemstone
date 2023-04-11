// ******************************************************************************************************
//  PqDiff.ts - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  07/26/2021 - S. Roche
//       Generated original version of source code.
//
// ******************************************************************************************************

namespace PqDiff{
    export namespace Types {
        export type MeasurementCharacteristic = 'None' | 'Instantaneous' | 'Spectra' | 'Peak' | 'RMS' | 'HRMS' | 'Frequency' | 'TotalTHD' | 'EvenTHD' | 'OddTHD' | 'CrestFactor' | 'FormFactor' | 'ArithSum' | 'S0S1' | 'S2S1' | 'SPos' | 'SNeg' | 'SZero' | 'AvgImbal' | 'TotalTHDRMS' | 'OddTHDRMS' | 'EvenTHDRMS' | 'TID' | 'TIDRMS' | 'IHRMS' | 'SpectraHGroup' | 'TIF' | 'FlkrMagAvg' | 'FlkrMaxDVV' | 'FlkrFreqMax' | 'FlkrMagMax' | 'FlkrWgtAvg' | 'FlkrSpectrum' | 'FlkrPST' | 'FlkrPLT' | 'TIFRMS' | 'PLTSlide' | 'PiLPF' | 'PiMax' | 'PiRoot' | 'PiRootLPF' | 'IT' | 'RMSDemand' | 'ANSITDF' | 'KFactor' | 'TDD' | 'RMSPeakDemand' | 'P' | 'Q' | 'S' | 'PF' | 'DF' | 'PDemand' | 'QDemand' | 'SDemand' | 'DFDemand' | 'PFDemand' | 'PPredDemand' | 'QPredDemand' | 'SPredDemand' | 'PCoQDemand' | 'PCoSDemand' | 'QCoPDemand' | 'QCoSDemand' | 'DFCoSDemand' | 'PFCoSDemand' | 'PFCoPDemand' | 'PFCoQDemand' | 'AngleFund' | 'QFund' | 'PFVector' | 'DFVector' | 'SVector' | 'SVectorFund' | 'SFund' | 'SCoPDemand' | 'SCoQDemand' | 'PFArith' | 'DFArith' | 'SArith' | 'SArithFund' | 'SPeakDemand' | 'QPeakDemand' | 'PPeakDemand' | 'PHarmonic' | 'PHarmonicUnsigned' | 'PFund' | 'PIntg' | 'PIntgPos' | 'PIntgPosFund' | 'PIntgNeg' | 'PIntgNegFund' | 'QIntg' | 'QIntgPos' | 'QIntgPosFund' | 'QIntgNegFund' | 'QIntgNeg' | 'SIntg' | 'SIntgFund' | 'PIVLIntg' | 'PIVLIntgPos' | 'PIVLIntgPosFund' | 'PIVLIntgNeg' | 'PIVLIntgNegFund' | 'QIVLIntg' | 'QIVLIntgPos' | 'QIVLIntgPosFund' | 'QIVLIntgNegFund' | 'QIVLIntgNeg' | 'SIVLIntg' | 'SIVLIntgFund' | 'DAxisField' | 'QAxis' | 'Rotational' | 'DAxis' | 'Linear' | 'TransferFunc' | 'Status' | 'SpectraIGroup'
        export type MeasurementType = 'None' | 'Voltage' | 'Current' | 'Power' | 'Energy' | 'Temperature' | 'Pressure' | 'Charge' | 'ElectricalField' | 'MagneticField' | 'Velocity' | 'Bearing' | 'Force' | 'Torque' | 'Position' | 'FluxLinkage' | 'FluxDensity' | 'Status'
        export type Phase = 'None' | 'AN' | 'BN' | 'CN' | 'NG' | 'AB' | 'BC' | 'CA' | 'Residual' | 'Net' | 'PositiveSequence' | 'NegativeSequence' | 'ZeroSequence' | 'Total' | 'LineToNeutralAverage' | 'LineToLineAverage' | 'Worst' | 'Plus' | 'Minus' | 'General1' | 'General2' | 'General3' | 'General4' | 'General5' | 'General6' | 'General7' | 'General8' | 'General9' | 'General10' | 'General11' | 'General12' | 'General13' | 'General14' | 'General15' | 'General16';
    }
    export namespace Lists{
        export const MeasurementTypes: Types.MeasurementType[] = ['None', 'Voltage', 'Current', 'Power', 'Energy', 'Temperature', 'Pressure', 'Charge', 'ElectricalField', 'MagneticField', 'Velocity', 'Bearing', 'Force', 'Torque', 'Position', 'FluxLinkage', 'FluxDensity', 'Status']
        export const MeasurementCharacteristics: Types.MeasurementCharacteristic[] = ['None', 'Instantaneous', 'Spectra', 'Peak', 'RMS', 'HRMS', 'Frequency', 'TotalTHD', 'EvenTHD', 'OddTHD', 'CrestFactor', 'FormFactor', 'ArithSum', 'S0S1', 'S2S1', 'SPos', 'SNeg', 'SZero', 'AvgImbal', 'TotalTHDRMS', 'OddTHDRMS', 'EvenTHDRMS', 'TID', 'TIDRMS', 'IHRMS', 'SpectraHGroup', 'TIF', 'FlkrMagAvg', 'FlkrMaxDVV', 'FlkrFreqMax', 'FlkrMagMax', 'FlkrWgtAvg', 'FlkrSpectrum', 'FlkrPST', 'FlkrPLT', 'TIFRMS', 'PLTSlide', 'PiLPF', 'PiMax', 'PiRoot', 'PiRootLPF', 'IT', 'RMSDemand', 'ANSITDF', 'KFactor', 'TDD', 'RMSPeakDemand', 'P', 'Q', 'S', 'PF', 'DF', 'PDemand', 'QDemand', 'SDemand', 'DFDemand', 'PFDemand', 'PPredDemand', 'QPredDemand', 'SPredDemand', 'PCoQDemand', 'PCoSDemand', 'QCoPDemand', 'QCoSDemand', 'DFCoSDemand', 'PFCoSDemand', 'PFCoPDemand', 'PFCoQDemand', 'AngleFund', 'QFund', 'PFVector', 'DFVector', 'SVector', 'SVectorFund', 'SFund', 'SCoPDemand', 'SCoQDemand', 'PFArith', 'DFArith', 'SArith', 'SArithFund', 'SPeakDemand', 'QPeakDemand', 'PPeakDemand', 'PHarmonic', 'PHarmonicUnsigned', 'PFund', 'PIntg', 'PIntgPos', 'PIntgPosFund', 'PIntgNeg', 'PIntgNegFund', 'QIntg', 'QIntgPos', 'QIntgPosFund', 'QIntgNegFund', 'QIntgNeg', 'SIntg', 'SIntgFund', 'PIVLIntg', 'PIVLIntgPos', 'PIVLIntgPosFund', 'PIVLIntgNeg', 'PIVLIntgNegFund', 'QIVLIntg', 'QIVLIntgPos', 'QIVLIntgPosFund', 'QIVLIntgNegFund', 'QIVLIntgNeg', 'SIVLIntg', 'SIVLIntgFund', 'DAxisField', 'QAxis', 'Rotational', 'DAxis', 'Linear', 'TransferFunc', 'Status', 'SpectraIGroup']
        export const Phases: Types.Phase[] = ['None' , 'AN' , 'BN' , 'CN' , 'NG' , 'AB' , 'BC' , 'CA' , 'Residual' , 'Net' , 'PositiveSequence' , 'NegativeSequence' , 'ZeroSequence' , 'Total' , 'LineToNeutralAverage' , 'LineToLineAverage' , 'Worst' , 'Plus' , 'Minus' , 'General1' , 'General2' , 'General3' , 'General4' , 'General5' , 'General6' , 'General7' , 'General8' , 'General9' , 'General10' , 'General11' , 'General12' , 'General13' , 'General14' , 'General15' , 'General16'];
    }
}

export default PqDiff;
