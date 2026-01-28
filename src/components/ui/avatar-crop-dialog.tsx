"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface AvatarCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob) => void
}

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

export function AvatarCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('无法获取 canvas context')
    }

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas is empty'))
        }
      }, 'image/jpeg', 0.9)
    })
  }

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) return

    setIsCropping(true)
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      onCropComplete(croppedImageBlob)
      onOpenChange(false)
    } catch (error) {
      console.error('裁剪失败:', error)
    } finally {
      setIsCropping(false)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>裁剪头像</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 裁剪区域 */}
          <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteHandler}
            />
          </div>

          {/* 缩放控制 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Slider
                value={[zoom]}
                onValueChange={(value: number[]) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>

            {/* 旋转按钮 */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="gap-2"
              >
                <RotateCw className="h-4 w-4" />
                旋转 90°
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isCropping}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleCropConfirm}
            disabled={isCropping || !croppedAreaPixels}
          >
            {isCropping ? "处理中..." : "确认裁剪"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
