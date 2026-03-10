'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
// NOTE: This component is not currently used. If enabled, re-introduce db-service exports.
const DatabaseService: any = null;
import { PatientDB, DoctorDB, CaretakerDB, Appointment } from '@/lib/models';
import { Calendar, User, Pill, Users } from 'lucide-react';

interface DatabaseViewerProps {
  userRole: 'patient' | 'doctor' | 'caretaker';
  userId: string;
}

export function DatabaseViewer({ userRole, userId }: DatabaseViewerProps) {
  const [patients, setPatients] = useState<PatientDB[]>([]);
  const [doctors, setDoctors] = useState<DoctorDB[]>([]);
  const [caretakers, setCaretakers] = useState<CaretakerDB[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // This component has been disabled from making direct DB calls.
        // It can be wired to call HTTP APIs if needed.
        const [patientsData, doctorsData, caretakersData] = await Promise.all([
          fetch('/api/patients').then(r => r.json()),
          fetch('/api/doctors').then(r => r.json()),
          fetch('/api/users').then(r => r.json()).then((u: any[]) => u.filter(x => x.role === 'caretaker')),
        ]);

        setPatients(patientsData);
        setDoctors(doctorsData);
        setCaretakers(caretakersData);

        // Load appointments based on user role
        // Appointments are not modeled in DB yet; skipping for now.

        setLoading(false);
      } catch (error) {
        console.error('Error loading database data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [userRole, userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPatientView = () => {
    const patient = patients.find(p => p.id === userId);
    const doctor = patient ? doctors.find(d => d.id === patient.doctorId) : null;
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Patient Code:</strong> {patient.patientCode}</p>
                <p><strong>Medical Conditions:</strong> {patient.medicalHistory.chronicConditions}</p>
                <p><strong>Allergies:</strong> {patient.medicalHistory.allergies}</p>
                <p><strong>Next Appointment:</strong> {patient.appointments.next}</p>
              </div>
            ) : (
              <p>Patient not found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assigned Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Specialization:</strong> {doctor.specialization || 'Not specified'}</p>
              </div>
            ) : (
              <p>No doctor assigned</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient?.medications.length ? (
              <div className="space-y-2">
                {patient.medications.map(med => (
                  <div key={med.id} className="p-2 border rounded">
                    <p><strong>{med.name}</strong> - {med.dosage}</p>
                    <p className="text-sm text-muted-foreground">{med.frequency}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No medications prescribed</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length ? (
              <div className="space-y-2">
                {appointments.map(apt => (
                  <div key={apt.id} className="p-2 border rounded">
                    <p><strong>Date:</strong> {apt.date}</p>
                    <p><strong>Time:</strong> {apt.time}</p>
                    <p><strong>Description:</strong> {apt.description}</p>
                    <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDoctorView = () => {
    const doctor = doctors.find(d => d.id === userId);
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Doctor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Specialization:</strong> {doctor.specialization || 'Not specified'}</p>
                <p><strong>Total Patients:</strong> {doctor.patientIds.length}</p>
              </div>
            ) : (
              <p>Doctor not found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor?.patientIds.length ? (
              <div className="space-y-2">
                {doctor.patientIds.map(patientId => {
                  const patient = patients.find(p => p.id === patientId);
                  return patient ? (
                    <div key={patientId} className="p-2 border rounded">
                      <p><strong>Name:</strong> {patient.name}</p>
                      <p><strong>Email:</strong> {patient.email}</p>
                      <p><strong>Conditions:</strong> {patient.medicalHistory.chronicConditions}</p>
                      <p><strong>Next Appointment:</strong> {patient.appointments.next}</p>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p>No patients assigned</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length ? (
              <div className="space-y-2">
                {appointments.map(apt => {
                  const patient = patients.find(p => p.id === apt.patientId);
                  return (
                    <div key={apt.id} className="p-2 border rounded">
                      <p><strong>Patient:</strong> {patient?.name || 'Unknown'}</p>
                      <p><strong>Date:</strong> {apt.date}</p>
                      <p><strong>Time:</strong> {apt.time}</p>
                      <p><strong>Description:</strong> {apt.description}</p>
                      <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                        {apt.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No appointments scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCaretakerView = () => {
    const caretaker = caretakers.find(c => c.id === userId);
    const patient = caretaker?.patientId ? patients.find(p => p.id === caretaker.patientId) : null;
    const doctor = patient?.doctorId ? doctors.find(d => d.id === patient.doctorId) : null;
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Caretaker Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caretaker ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {caretaker.name}</p>
                <p><strong>Email:</strong> {caretaker.email}</p>
                <p><strong>Relationship:</strong> {caretaker.relationship || 'Not specified'}</p>
                <p><strong>Patient:</strong> {patient?.name || 'No patient linked'}</p>
              </div>
            ) : (
              <p>Caretaker not found</p>
            )}
          </CardContent>
        </Card>

        {patient && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>Patient Code:</strong> {patient.patientCode}</p>
                  <p><strong>Medical Conditions:</strong> {patient.medicalHistory.chronicConditions}</p>
                  <p><strong>Allergies:</strong> {patient.medicalHistory.allergies}</p>
                  <p><strong>Next Appointment:</strong> {patient.appointments.next}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient's Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {doctor ? (
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {doctor.name}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Specialization:</strong> {doctor.specialization || 'Not specified'}</p>
                  </div>
                ) : (
                  <p>No doctor assigned</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Patient's Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medications.length ? (
                  <div className="space-y-2">
                    {patient.medications.map(med => (
                      <div key={med.id} className="p-2 border rounded">
                        <p><strong>{med.name}</strong> - {med.dosage}</p>
                        <p className="text-sm text-muted-foreground">{med.frequency}</p>
                        <div className="mt-2">
                          {med.doses.map(dose => (
                            <Badge key={dose.scheduled} variant={
                              dose.status === 'taken' ? 'default' : 
                              dose.status === 'skipped' ? 'destructive' : 'secondary'
                            } className="mr-1">
                              {dose.scheduled}: {dose.status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No medications prescribed</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Patient's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length ? (
                  <div className="space-y-2">
                    {appointments.map(apt => (
                      <div key={apt.id} className="p-2 border rounded">
                        <p><strong>Date:</strong> {apt.date}</p>
                        <p><strong>Time:</strong> {apt.time}</p>
                        <p><strong>Description:</strong> {apt.description}</p>
                        <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No appointments scheduled</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Database Information</h2>
        <Badge variant="outline">MongoDB Connected</Badge>
      </div>
      
      {userRole === 'patient' && renderPatientView()}
      {userRole === 'doctor' && renderDoctorView()}
      {userRole === 'caretaker' && renderCaretakerView()}
    </div>
  );
}
