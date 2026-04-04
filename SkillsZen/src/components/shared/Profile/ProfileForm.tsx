import React, { useRef, useState } from 'react'
import { Loader2, ArrowRight, User, Globe, Calendar, Phone, Camera, Check } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { toast } from 'sonner'
import type { ProfileValues } from '../../../types/UserTypes'
import { compressImage } from '../../../services/imageHelper'
import { cn } from '../../../lib/utils'


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
        <div className="flex justify-center pb-2 w-full px-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <Button
            type="button"
            disabled={isProcessingImage || isSubmitting}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'h-12 w-full rounded-2xl transition-all duration-300 gap-3 font-bold text-sm shadow-sm border-none',
              isPhotoAttached
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100 shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {isProcessingImage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPhotoAttached ? (
              <Check className="h-5 w-5 animate-in zoom-in duration-300" />
            ) : (
              <Camera className="h-5 w-5" />
            )}

            <span className="tracking-tight">
              {isProcessingImage
                ? 'Processing Photo...'
                : isPhotoAttached
                  ? 'Photo Attached & Ready'
                  : 'Change Profile Photo'}
            </span>
          </Button>
        </div>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Full Name
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="John Doe"
                    {...field}
                    value={field.value || ''}
                    className="h-11 pl-11 rounded-2xl bg-slate-50/50 border-slate-200 transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[9px] font-bold ml-1 text-red-500" />
            </FormItem>
          )}
        />

        {/* Country & Birth Date Grid */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                  Country
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="USA"
                      {...field}
                      value={field.value || ''}
                      className="h-11 pl-11 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                  Birth Date
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ''}
                      className="h-11 pl-11 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                Phone Number
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="+1 (555) 000-0000"
                    {...field}
                    value={field.value || ''}
                    className="h-11 pl-11 rounded-2xl bg-slate-50/50 border-slate-200 transition-all focus:bg-white"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[9px] font-bold ml-1 text-red-500" />
            </FormItem>
          )}
        />

        {/* Final Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isProcessingImage}
          className="w-full h-12 px-5 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 ease-in-out hover:shadow-lg active:scale-[0.98] font-black uppercase tracking-[0.2em] text-[11px] mt-4 shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-3">
              Update Profile
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
