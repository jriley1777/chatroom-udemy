import React from 'react';
import styled from 'styled-components';

const StyledContent = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const MissingRoute = () => {
    return (
        <StyledContent>404. Page not found.</StyledContent>
    )
}

export default MissingRoute;