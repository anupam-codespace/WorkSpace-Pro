import React from "react";
import { Lightning, Compass, Check, CaretRight, X } from '@phosphor-icons/react';
import { Button } from "../../ui/button";
import { ProjectMode } from "../types";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

interface ProjectCardProps extends React.PropsWithChildren<{}> {
  onClick: () => void;
  isSelected: boolean;
}

function ProjectCard({ children, onClick, isSelected }: ProjectCardProps) {
  return (
    <div 
      className={`basis-0 bg-background grow h-auto relative rounded-3xl shrink-0 cursor-pointer transition-all duration-200 hover:shadow-xl/5 border border-border/60`}
      onClick={onClick}
    >
      <div className="overflow-clip size-full">
        <div className="content-stretch flex flex-col gap-10 items-start p-6 relative size-full">{children}</div>
      </div>
    </div>
  );
}

type HelperProps = {
  text: string;
  text1: string;
};

function Helper({ text, text1 }: HelperProps) {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1.5 grow items-start justify-center min-h-px min-w-px relative shrink-0">
      <p className="font-semibold leading-6 relative shrink-0 text-foreground text-base text-nowrap">{text}</p>
      <p className="font-normal h-5 leading-5 relative shrink-0 text-muted-foreground text-sm w-full">{text1}</p>
    </div>
  );
}

interface StepModeProps {
  selected?: ProjectMode;
  onSelect: (mode: ProjectMode) => void;
  onCancel?: () => void;
  onContinue?: () => void;
  onClose?: () => void;
}

export function StepMode({ selected, onSelect, onCancel, onContinue, onClose }: StepModeProps) {
  return (
    <div className="bg-muted relative rounded-3xl size-full" data-name="Card">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-4 items-start overflow-clip pb-4 pt-6 px-4 relative size-full">
          
          {/* Header Text */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="flex items-center justify-center px-2 py-0 relative w-full">
                <p className="basis-0 font-normal grow leading-5 min-h-px min-w-px relative shrink-0 text-muted-foreground text-sm">{`Choose how you'd like to set up your project`}</p>
              </div>
            </div>
          </div>

          {/* Cards Container */}
          <div className="content-stretch flex gap-1 items-start px-0 py-2 relative shrink-0 w-full">
            
            {/* Quick Create Card */}
            <ProjectCard onClick={() => onSelect('quick')} isSelected={selected === 'quick'}>
              <div className="content-stretch flex items-center p-3 relative rounded-xl shrink-0">
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-xl" />
                <Lightning className="size-6 text-muted-foreground" />
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Card / Header">
                  <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0">
                    <Helper text="Quick create" text1="Create a project with minimal setup" />
                  </div>
                </div>
              </div>
              
              {/* Checkbox State */}
              {selected === 'quick' ? (
                 <div className="absolute bg-green-600 right-6 rounded-3xl size-6 top-6" data-name="Checkbox">
                   <div className="overflow-clip relative rounded-[inherit] size-full">
                     <div className="absolute left-1/2 size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Check">
                       <Check className="size-4 text-primary-foreground" />
                     </div>
                   </div>
                   <div aria-hidden="true" className="absolute border border-green-600 border-solid inset-0 pointer-events-none rounded-3xl" />
                 </div>
              ) : (
                <div className="absolute bg-background right-6 rounded-3xl size-6 top-6" data-name="Checkbox">
                  <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-3xl" />
                </div>
              )}
            </ProjectCard>

            {/* Guided Setup Card */}
            <ProjectCard onClick={() => onSelect('guided')} isSelected={selected === 'guided'}>
              <div className="content-stretch flex items-center p-3 relative rounded-[16px] shrink-0">
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[16px]" />
                <Compass className="size-6 text-muted-foreground" />
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Card / Header">
                  <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0">
                    <Helper text="Guided Setup" text1="Define Goal, ownership, and structure" />
                  </div>
                </div>
              </div>

               {/* Checkbox State */}
               {selected === 'guided' ? (
                 <div className="absolute bg-green-600 right-6 rounded-3xl size-6 top-6" data-name="Checkbox">
                   <div className="overflow-clip relative rounded-[inherit] size-full">
                     <div className="absolute left-1/2 size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Check">
                       <Check className="size-4 text-primary-foreground" />
                     </div>
                   </div>
                   <div aria-hidden="true" className="absolute border border-green-600 border-solid inset-0 pointer-events-none rounded-3xl" />
                 </div>
              ) : (
                <div className="absolute bg-background right-6 rounded-3xl size-6 top-6" data-name="Checkbox">
                  <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-3xl" />
                </div>
              )}
            </ProjectCard>
          </div>

          {/* Footer */}
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full mt-auto" data-name="Card / Footer">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="h-10 px-4 rounded-xl"
            >
              Cancel
            </Button>

            {/* Continue Button */}
            <Button
              type="button"
              onClick={onContinue}
              className="h-10 px-4 rounded-xl gap-2"
            >
              <span className="text-sm font-medium">Continue</span>
              <CaretRight className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-3 opacity-70 hover:opacity-100 rounded-xl"
          >
            <X className="size-4 text-muted-foreground" />
          </Button>

        </div>
      </div>
    </div>
  );
}
