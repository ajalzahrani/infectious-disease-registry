"use server";
import { prisma } from "@/lib/prisma";
import { Patient } from "@prisma/client";
import { z } from "zod";

const patientSchema = z.object({
  mrn: z.string().min(1, "MRN is required"),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  diseases: z.array(z.string()).min(1, "At least one disease must be selected"),
  registeredBy: z.string().min(1, "Registered by is required"),
});

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        registries: {
          include: {
            disease: true,
            registeredBy: true,
          },
        },
        relatives: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}

export async function createPatient(data: any) {
  try {
    // Validate the input data
    const validatedData = patientSchema.parse(data);

    const { diseases, registeredBy, mrn, ...patientData } = validatedData;

    // Define the date range for checking existing patients
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Start of the day
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of the day

    // Check if a patient with the same MRN exists within the date range
    const existingPatient = await prisma.patient.findFirst({
      where: {
        mrn,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (existingPatient) {
      return {
        success: false,
        error: "A patient with this MRN already exists for today.",
      };
    }

    // Create the patient with registries in a transaction
    const patient = await prisma.$transaction(async (tx) => {
      // First create the patient
      const newPatient = await tx.patient.create({
        data: {
          ...patientData,
          mrn,
          registries: {
            create: diseases.map((diseaseId: string) => ({
              disease: { connect: { id: diseaseId } },
              registeredBy: { connect: { id: registeredBy } },
              contacted: false,
            })),
          },
        },
        include: {
          registries: {
            include: {
              disease: true,
              registeredBy: true,
            },
          },
        },
      });

      // Create activity for new patient
      await tx.activity.create({
        data: {
          type: "PATIENT_ADDED",
          description: `New patient added: ${newPatient.name}`,
          patientId: newPatient.id,
          userId: registeredBy,
        },
      });

      return newPatient;
    });

    return { success: true, data: patient };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error creating patient:", errorMessage);

    return {
      success: false,
      error: `Failed to create patient: ${errorMessage}`,
    };
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        registries: {
          include: {
            disease: true,
            registeredBy: true,
          },
        },
        relatives: true,
      },
    });
    return patient;
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
}

export async function updatePatient(patient: Patient): Promise<Patient> {
  const updatedPatient = await prisma.patient.update({
    where: { id: patient.id },
    data: patient,
  });
  return updatedPatient;
}

export async function deletePatient(id: string) {
  try {
    const patient = await prisma.patient.delete({
      where: { id },
    });
    return patient;
  } catch (error) {
    console.error("Error deleting patient:", error);
    return null;
  }
}

export async function getFilteredPatients({
  mrn,
  disease,
  status,
  from,
  to,
}: {
  mrn?: string;
  disease?: string;
  status?: string;
  from?: string;
  to?: string;
}) {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          mrn
            ? {
                mrn: { contains: mrn },
              }
            : {},
          disease
            ? {
                registries: {
                  some: {
                    diseaseId: disease,
                  },
                },
              }
            : {},
          status
            ? {
                registries: {
                  some: {
                    contacted: status === "contacted",
                  },
                },
              }
            : {},
          from && to
            ? {
                createdAt: {
                  gte: new Date(from),
                  lte: new Date(to),
                },
              }
            : {},
        ],
      },
      include: {
        registries: {
          include: {
            disease: true,
            registeredBy: true,
          },
        },
        relatives: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: patients };
  } catch (error) {
    console.error("Failed to fetch filtered patients:", error);
    return { success: false, error: "Failed to fetch patients" };
  }
}
