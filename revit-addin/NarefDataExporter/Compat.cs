#if !NET5_0_OR_GREATER
// Enables C# 'init' accessors when targeting .NET Framework 4.8 (Revit 2021-2024).
namespace System.Runtime.CompilerServices
{
    internal static class IsExternalInit { }
}
#endif
