import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest'
import { ExerciseCard } from './exerciseCard'
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("Exercise card", () => {
        const exerciseCard = <MemoryRouter>
            <ExerciseCard key={1} name="JS" icon="js" description="some desc" id={""} />
        </MemoryRouter>

    it("renders js exercise card description", () => {
        render(exerciseCard)
        expect(screen.getByText('some desc')).toBeInTheDocument()
    })

    it("renders js exercise card name", () => {
        render(exerciseCard)
        expect(screen.getByText('JS')).toBeInTheDocument()
    })
})