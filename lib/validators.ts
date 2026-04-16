import { z } from 'zod'

export const sendOtpSchema = z.object({
  email: z.string().email('Email invalide').max(254),
})

export const verifyOtpSchema = z.object({
  sessionId: z.string().uuid('Session invalide'),
  code: z.string().length(6, 'Code à 6 chiffres').regex(/^\d+$/, 'Chiffres uniquement'),
})

export const submitSchema = z.object({
  sessionId:        z.string().uuid(),
  eluId:            z.string().uuid(),
  eluNom:           z.string().max(200),
  eluChambre:       z.enum(['assemblee', 'senat', 'europarl']),
  scoreConditions:  z.number().int().min(1).max(5),
  scoreManagement:  z.number().int().min(1).max(5),
  scoreCharge:      z.number().int().min(1).max(5),
  scoreAmbiance:    z.number().int().min(1).max(5),
  scoreEquilibre:   z.number().int().min(1).max(5),
  temoignage:       z.string().max(1000).nullable().optional(),
  recommande:       z.boolean().nullable().optional(),
  dureesMois:       z.number().int().min(0).max(600).nullable().optional(),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
})

export const adminActionSchema = z.object({
  id:     z.string().uuid(),
  action: z.enum(['validate', 'reject']),
})
