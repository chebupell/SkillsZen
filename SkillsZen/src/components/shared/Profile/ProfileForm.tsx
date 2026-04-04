import React, { useRef, useState } from 'react'
import { Loader2, ArrowRight, User, Globe, Calendar, Phone } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { Form } from '../../ui/form'
import { Button } from '../../ui/button'
import { toast } from 'sonner'
import type { ProfileValues } from '../../../types/UserTypes'
import { compressImage } from '../../../services/imageHelper'
import { PhotoUpload } from './PhotoUpload'
import { SmartFormField } from './SmartFormField'

interface ProfileFormProps {
  form: UseFormReturn<ProfileValues>
  onSubmit: (data: ProfileValues) => Promise<void>
  isSubmitting: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ form, onSubmit, isSubmitting }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [isPhotoAttached, setIsPhotoAttached] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Max 10MB')
      return
    }
    const toastId = toast.loading('Processing image...')
    setIsProcessingImage(true)
    setIsPhotoAttached(false)
    try {
      const base64 = await compressImage(file, 300)
      form.setValue('photo', base64, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      setIsPhotoAttached(true)
      toast.success('Photo attached! Ready to save.', { id: toastId })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to process image'

      toast.error(message, { id: toastId })
    } finally {
      setIsProcessingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (data: ProfileValues) => {
    await onSubmit(data)
    setIsPhotoAttached(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <PhotoUpload
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          isProcessing={isProcessingImage}
          isAttached={isPhotoAttached}
          disabled={isProcessingImage || isSubmitting}
        />
        <SmartFormField
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          icon={User}
        />
        <div className="grid grid-cols-2 gap-4">
          <SmartFormField
            control={form.control}
            name="country"
            label="Country"
            placeholder="USA"
            icon={Globe}
          />
          <SmartFormField
            control={form.control}
            name="birthDate"
            label="Birth Date"
            icon={Calendar}
            type="date"
          />
        </div>
        <SmartFormField
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          icon={Phone}
        />
        <Button
          type="submit"
          disabled={isSubmitting || isProcessingImage}
          className="w-full h-12 px-5 rounded-2xl bg-primary font-black uppercase tracking-[0.2em] text-[11px] mt-4"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-3">
              Update Profile
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
