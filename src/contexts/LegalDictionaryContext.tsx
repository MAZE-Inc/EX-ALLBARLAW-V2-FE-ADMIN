import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LegalTermData {
  id: number
  koreanName: string
  englishName: string
  chineseName: string
}

interface LegalDictionaryContextType {
  selectedLegalTerms: LegalTermData[]
  setSelectedLegalTerms: React.Dispatch<React.SetStateAction<LegalTermData[]>>
  selectedReports: any[]
  setSelectedReports: React.Dispatch<React.SetStateAction<any[]>>
}

const LegalDictionaryContext = createContext<LegalDictionaryContextType | undefined>(undefined)

export const LegalDictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLegalTerms, setSelectedLegalTerms] = useState<LegalTermData[]>([])
  const [selectedReports, setSelectedReports] = useState<any[]>([])

  return (
    <LegalDictionaryContext.Provider 
      value={{ 
        selectedLegalTerms, 
        setSelectedLegalTerms,
        selectedReports,
        setSelectedReports
      }}
    >
      {children}
    </LegalDictionaryContext.Provider>
  )
}

export const useLegalDictionary = () => {
  const context = useContext(LegalDictionaryContext)
  if (!context) {
    throw new Error('useLegalDictionary must be used within a LegalDictionaryProvider')
  }
  return context
}