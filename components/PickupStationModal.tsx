
'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// Pickup station type
export interface PickupStation {
    id: number
    name: string
    address: string
    closeTo: string
    hours: string
    fee: number
}

// Mock pickup stations data
export const pickupStations: PickupStation[] = [
    {
        id: 1,
        name: 'SpeedAF Pickup Station Ada George',
        address: 'No 41, Rumuepirikom, Rumuolumeni/wofe Road Port Harcourt, Opposite Heritage Fueling Station PORTHARCOURT-ADA GEORGE, Rivers.',
        closeTo: 'Close to Opposite Heritage Fueling Station',
        hours: 'Mon-Fri 8 AM - 6 PM; SAT 9AM - 5PM',
        fee: 1700
    },
    {
        id: 2,
        name: 'SpeedAF Pickup Station Ahoada',
        address: 'No 41, Rumuepirikom, Rumuolumeni/wofe Road Port Harcourt, Opposite Heritage Fueling Station PORTHARCOURT-ADA GEORGE, Rivers.',
        closeTo: 'Close to Opposite Heritage Fueling Station',
        hours: 'Mon-Fri 8 AM - 6 PM; SAT 9AM - 5PM',
        fee: 1700
    },
    {
        id: 3,
        name: 'SpeedAF Pickup Station Aluu',
        address: 'No 41, Rumuepirikom, Rumuolumeni/wofe Road Port Harcourt, Opposite Heritage Fueling Station PORTHARCOURT-ADA GEORGE, Rivers.',
        closeTo: 'Close to Opposite Heritage Fueling Station',
        hours: 'Mon-Fri 8 AM - 6 PM; SAT 9AM - 5PM',
        fee: 1700
    },
    {
        id: 4,
        name: 'SpeedAF Pickup Station Bonnu Island',
        address: 'No 41, Rumuepirikom, Rumuolumeni/wofe Road Port Harcourt, Opposite Heritage Fueling Station PORTHARCOURT-ADA GEORGE, Rivers.',
        closeTo: 'Close to Opposite Heritage Fueling Station',
        hours: 'Mon-Fri 8 AM - 6 PM; SAT 9AM - 5PM',
        fee: 1700
    }
]

interface PickupStationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelectStation: (station: PickupStation) => void
    selectedStation: PickupStation | null
}

export default function PickupStationModal({ 
    open, 
    onOpenChange, 
    onSelectStation,
    selectedStation 
}: PickupStationModalProps) {
    const [tempSelectedStation, setTempSelectedStation] = useState<PickupStation | null>(selectedStation)

    const handleConfirmSelection = () => {
        if (tempSelectedStation) {
            onSelectStation(tempSelectedStation)
            onOpenChange(false)
        }
    }

    const handleClose = () => {
        setTempSelectedStation(selectedStation)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Pickup Stations</DialogTitle>
                    <p className='text-sm text-[#A0A0A0]'>Select the pickup stations closest to you</p>
                </DialogHeader>
                
                <div className=' mt-4'>
                    <div className='w-full space-y-4'>
                        {/* Filters */}
                        <div className='flex gap-2'>
                            <Select>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Rivers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rivers">Rivers</SelectItem>
                                    <SelectItem value="lagos">Lagos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="portharcourt">Port Harcourt</SelectItem>
                                    <SelectItem value="lagos">Lagos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pickup Stations List */}
                        <RadioGroup 
                            value={tempSelectedStation?.id.toString()} 
                            onValueChange={(value) => {
                                const station = pickupStations.find(s => s.id.toString() === value)
                                setTempSelectedStation(station || null)
                            }}
                        >
                            <div className='space-y-3 max-h-[400px] overflow-y-auto pr-2'>
                                {pickupStations.map((station) => (
                                    <div 
                                        key={station.id} 
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                                            tempSelectedStation?.id === station.id 
                                                ? 'border-[#4FCA6A] bg-[#F0FDF4]' 
                                                : 'border-[#E0E0E0] hover:border-[#4FCA6A]'
                                        }`}
                                        onClick={() => setTempSelectedStation(station)}
                                    >
                                        <div className='flex items-start gap-3'>
                                            <RadioGroupItem 
                                                value={station.id.toString()} 
                                                id={`station-${station.id}`} 
                                                className='mt-1' 
                                            />
                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between gap-2'>
                                                    <Label 
                                                        htmlFor={`station-${station.id}`} 
                                                        className='font-medium text-sm cursor-pointer'
                                                    >
                                                        {station.name}
                                                    </Label>
                                                    <span className='text-[#4FCA6A] text-sm bg-[#E8F5E9] px-2 py-1 rounded whitespace-nowrap'>
                                                        ₦{station.fee.toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className='text-xs text-[#A0A0A0] mt-2'>{station.address}</p>
                                                <div className='flex items-center gap-1 mt-2 text-xs text-[#A0A0A0]'>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                        <circle cx="12" cy="10" r="3"/>
                                                    </svg>
                                                    <span>{station.closeTo}</span>
                                                </div>
                                                <div className='flex items-center gap-1 mt-1 text-xs text-[#A0A0A0]'>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    <span>Opening Hours: {station.hours}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>

                   
                </div>

                <DialogFooter className='flex flex-row justify-between gap-2 mt-4'>
                    <Button variant="outline" onClick={handleClose}>Close</Button>
                    <Button 
                        className='bg-[#4FCA6A] hover:bg-[#45b85e]' 
                        onClick={handleConfirmSelection}
                        disabled={!tempSelectedStation}
                    >
                        Select Pickup Station
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}