import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Project {
    img: string;
    title: string;
    description?: string;
    descriptionEs?: string;
    descriptionEn?: string;
    descriptionKr?: string;
    link?: string;
    techStack?: string;
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    type: string;
    description?: string;
    skills?: string[];
}

export const usePortfolioData = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://docs.google.com/spreadsheets/d/168w2UO0emiLD9TKy00D65mCr5W3B6zz3hhsndK-rMfU/gviz/tq?tqx=out:json"
                );

                // Parse the weird Google Visualization API response
                const newData = response.data.replace("/*O_o*/", "");
                const startIdx = newData.indexOf("{");
                const jsonString = newData.substring(startIdx, newData.length - 2);
                const parsedData = JSON.parse(jsonString);

                const projectsArray = parsedData.table.rows.slice(1).map((row: any) => {
                    const img = row.c[1]?.v || '';
                    const title = row.c[2]?.v || '';
                    const descriptionEs = row.c[3]?.v || '';
                    const descriptionEn = row.c[4]?.v || '';
                    const descriptionKr = row.c[5]?.v || '';
                    const link = row.c[6]?.v || '';
                    const techStack = row.c[7]?.v || '';
                    return {
                        img,
                        title,
                        descriptionEs,
                        descriptionEn,
                        descriptionKr,
                        link,
                        techStack
                    };
                }).filter((pro) => pro.title !== "");

                const experiencesArray = parsedData.table.rows.slice(1).map((row: any) => {
                    const company = row.c[10]?.v || '';
                    const role = row.c[11]?.v || '';
                    const period = row.c[12]?.v || '';
                    const type = row.c[13]?.v || '';
                    const description = row.c[14]?.v || '';
                    return {
                        company,
                        role,
                        period,
                        type,
                        description
                    };
                }).filter((exp) => exp.company !== "");

                setExperiences(experiencesArray);
                setProjects(projectsArray);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching portfolio data:", err);
                setError("Failed to load projects");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { projects, experiences, loading, error };
};
